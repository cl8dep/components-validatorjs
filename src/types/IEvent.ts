interface IEvent {
  target: {
    value: string | number | boolean | object;
    name: string;
  }
}

export default IEvent;