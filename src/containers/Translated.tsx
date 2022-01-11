import { connect } from 'react-redux'

export interface ITranslation {
  description?: string
  label?: string
  locale: IProps['locale']
  location?: string
  name?: string
  terms?: string
}

interface IProps {
  children: ({ locale }: ITranslation) => any
  defaultLocale?: string
  locale: string
  values: ReadonlyArray<ITranslation>
}

const Translated = ({
  children,
  values,
  locale,
  defaultLocale = 'en_US',
}: IProps) => {
  const translation =
    values &&
    (values.find(value => value.locale === locale) ||
      values.find(value => value.locale === defaultLocale))

  return children(translation)
}

export default connect((state: IReduxState) => ({ locale: state.app.locale }))(
  Translated,
)
