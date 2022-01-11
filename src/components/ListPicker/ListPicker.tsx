import React from 'react'
import Localized from 'containers/Localized'
import { ListPickerItem } from './'
import { ColorPalette } from '@allthings/colors'
import FormGroup from 'components/Form/FormGroup'
import FormGroupItem from 'components/Form/FormGroupItem'
import ChevronLeftIcon from '@allthings/react-ionicons/lib/ChevronLeftIcon'
import { css } from 'glamor'

const itemLabel = css({
  display: 'block',
})

interface IProps {
  name?: string
  items?: ReadonlyArray<any>
  chooseLabel?: JSX.Element
  chosenItem: string
  onItemChoose: (id: string, key: string) => void
  triggerHide: () => void
}

class ListPicker extends React.Component<IProps> {
  handleChange = (id: string, key: string) => {
    this.props.onItemChoose(id, key)
    this.props.triggerHide()
  }

  render() {
    return (
      <div data-e2e={`service-center-overlay-${this.props.name}-list`}>
        <div className="contentList">
          <ul className="contentList-list">
            <li className="contentList-list-item contentList-list-item-goBack">
              <span
                onClick={this.props.triggerHide}
                className="contentList-list-item-link"
              >
                <i className="contentList-list-item-leftArrow">
                  <ChevronLeftIcon
                    style={{
                      fill: ColorPalette.lightGreyIntense,
                      width: 16,
                      height: 16,
                    }}
                  />
                </i>
                <h3 className="contentList-list-item-title theme-support-text">
                  {this.props.chooseLabel}
                </h3>
              </span>
            </li>
          </ul>
        </div>
        <FormGroup>
          {this.props.items.map(item => (
            <FormGroupItem inline key={item.id}>
              <ListPickerItem
                name={this.props.name}
                itemKey={item.key}
                id={item.id}
                onChange={this.handleChange}
                isChosen={this.props.chosenItem === item.id}
              />
              <label
                data-e2e={`service-center-${this.props.name}-label-${item.id}`}
                htmlFor={item.id}
                {...itemLabel}
              >
                {item.name ? <Localized messages={item.name} /> : item.key}
              </label>
            </FormGroupItem>
          ))}
        </FormGroup>
      </div>
    )
  }
}

export default ListPicker
