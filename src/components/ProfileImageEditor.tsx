import React from 'react'
import AvatarEditor from 'react-avatar-editor'
import { css } from 'glamor'
import FileChooser from 'components/FileChooser'
import { ColorPalette } from '@allthings/colors'
import { Button, Icon, View } from '@allthings/elements'
import {
  getCorrectedRotation,
  getImageOrientation,
} from 'utils/getImageOrientation'
import { FileWithPath } from 'react-dropzone'

const styles = {
  imageEditor: css({
    background: '#fff',
    cursor: 'pointer',
    boxShadow: '0 0 14px 0 rgba(0,0,0,0.05)',
    alignSelf: 'center',
    borderRadius: '50%',
    overflow: 'hidden',
    // avatar + (border * 2)
    height: 224,
    width: 224,
    margin: 10,
  }),
}

// @TODO: Find a replacement for this library since it's designed to be used by
// default with Browserify, see:
// https://github.com/nodeca/pica#install
const pica = new (require('pica/dist/pica'))()

interface IProps {
  children?: (fn: () => void) => void
  profileImage: FileWithPath
  scale?: number
  triggerClose?: () => void
}

interface IState {
  image: File
  name: string
  type: string
  rotation: number
  scale: number
}

class ProfileImageEditor extends React.Component<IProps, IState> {
  state: IState = {
    image: null,
    name: null,
    type: null,
    scale: 1,
    rotation: 0,
  }

  componentDidMount() {
    if (
      this.props.profileImage &&
      typeof this.props.profileImage !== 'string'
    ) {
      this.applyImage(this.props.profileImage)
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      this.props.profileImage !== prevProps.profileImage &&
      typeof this.props.profileImage !== 'string'
    ) {
      this.applyImage(this.props.profileImage)
    }
  }

  applyImage = async (file: File) => {
    const [image, orientation] = await Promise.all([
      this.getImagePreview(file),
      getImageOrientation(file),
    ])
    const rotation = getCorrectedRotation(orientation)

    this.setState({
      image,
      name: file.name,
      type: file.type,
      rotation,
      scale: 1,
    })
  }

  avatarEditor: AvatarEditor = null

  setAvatarEditor = (avatarEditor: AvatarEditor) =>
    (this.avatarEditor = avatarEditor)

  getImage = async (callback: (blob: Blob) => void) => {
    if (this.avatarEditor) {
      const image = this.avatarEditor.getImage()
      const offScreenCanvas = document.createElement('canvas')

      // Set max width/height to reasonable(?) 800px
      // The largest we currently show is 225px
      offScreenCanvas.width = Math.min(800, image.width)
      offScreenCanvas.height = Math.min(800, image.height)

      const result = await pica.resize(image, offScreenCanvas, { alpha: true })
      const blob = await pica.toBlob(result, this.state.type, 0.9)

      callback(blob)
    }
  }

  getImagePreview = (file: File): Promise<FileWithPath> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: any) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  handleChoose = (files: readonly FileWithPath[]) =>
    files[0] && this.applyImage(files[0])

  setScale = (e: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ scale: parseFloat(e.target.value) })

  handleRotateRight = () =>
    this.setState(state => ({ rotation: (state.rotation + 90) % 360 }))

  handleRotateLeft = () =>
    this.setState(state => ({ rotation: (state.rotation - 90) % 360 }))

  render() {
    const activeImage = this.state.image || this.props.profileImage

    return (
      <FileChooser accept="image/jpeg,image/png" onChoose={this.handleChoose}>
        {openFileDialog => (
          <View alignH="center" alignV="center" direction="column">
            <View direction="row" alignV="center">
              {activeImage && (
                <Button
                  onClick={this.handleRotateLeft}
                  backgroundColor={ColorPalette.grey}
                >
                  <Icon color="#fff" size="xs" name="sync-filled" />
                </Button>
              )}
              <View
                direction="row"
                alignH="center"
                alignV="center"
                {...styles.imageEditor}
              >
                {activeImage ? (
                  <AvatarEditor
                    image={activeImage}
                    crossOrigin="anonymous"
                    ref={this.setAvatarEditor}
                    width={200}
                    borderRadius={160}
                    height={200}
                    border={12}
                    color={[255, 255, 255, 1]} // RGBA
                    rotate={this.state.rotation}
                    scale={this.props.scale || this.state.scale}
                  />
                ) : (
                  <Icon
                    name="camera-filled"
                    color={ColorPalette.lightGreyIntense}
                    size={100}
                  />
                )}
              </View>
              {activeImage && (
                <Button
                  onClick={this.handleRotateRight}
                  backgroundColor={ColorPalette.grey}
                >
                  <Icon
                    color="#fff"
                    size="xs"
                    name="sync-filled"
                    {...css({ transform: 'rotateY(180deg)' })}
                  />
                </Button>
              )}
            </View>
            {!this.props.scale && activeImage && (
              <View {...css({ width: 224, margin: 15 })}>
                <input
                  type="range"
                  max={2}
                  min={1}
                  step={0.1}
                  onChange={this.setScale}
                  value={this.state.scale}
                />
                <View /> {/* Fix for Firefox bug APP-2180 */}
              </View>
            )}
            {this.props.children && this.props.children(openFileDialog)}
          </View>
        )}
      </FileChooser>
    )
  }
}

export default ProfileImageEditor
