class Message {
  date: Date = null
  isFromUser: boolean = null
  text: string = null
  constructor(text: string, date = new Date(), isFromUser = true) {
    this.text = text
    this.date = date
    this.isFromUser = isFromUser
  }
}

export default Message
