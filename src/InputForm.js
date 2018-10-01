import React from 'react';
const InputForm = (props) => {
return (
  <React.Fragment>
    <form onSubmit={props.formSubmitted}>

    <div className= {(props.isLoading)?"control is-loading":"control"}>
      <input
        className= "input"
        onChange={props.inputChanged}
        type="text"
        placeholder={props.placeholder}
        value={props.inputValue}
      />
    </div>
    </form>
  </React.Fragment>
);
}

export default InputForm;