# High Component Order for ValidatorJS library

This library provides a High Component Order(HOC) for the real-time 
validation of React web form fields.
The validation engine is using [validatorjs](https://www.npmjs.com/package/validatorjs)
package.

## How use it

```jsx
function MyComponent(props) {
  
    return (
      <div>
        <input name="name" onChange={props.onFormChange}
               value={props.formState.name.value}/>

        <button disabled={props.formState.isPristine || !props.formState.isValid}>
            Submit
        </button>
      </div>
    )
}

const WithFormHandler = FormHandler({
  name: "string|required"
})(MyComponent);

export default WithFormHandler

```

## License
These libs and it's source code is distribute using MIT license. 
You can read the license [here](./LICENSE)

## Contributing