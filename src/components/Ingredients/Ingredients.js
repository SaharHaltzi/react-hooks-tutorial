import React, {useState, useCallback, useReducer, useEffect} from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientsReducer = (currentIngredientState, action)=> {

  switch(action.type)
  {
     case 'SET':
        return [...action.ingredients];
     case 'ADD':
        return [...currentIngredientState, action.ingredient]
     case 'DELETE': 
        return currentIngredientState.filter((ingredient)=> {return ingredient.id !== action.id});
     default:
      throw Error('YOU DONT NEED TO GET IN HERE');
  }
}

const httpReducer = (currentHttpState, action) => {
    switch(action.type)
    {
      case 'SEND':
        return {isLoading: true, error: null} 
      case 'RESPONSE':
        return {...currentHttpState, isLoading: false}
      case 'ERROR':
        return {isLoading: false, error: action.errorMessage}
      case 'CLEAR': 
        return {...currentHttpState, error:null}
      default: 
        throw Error('YOU DONT NEED TO GET IN HERE');
    }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, []);
  const [httpState, httpDispatch] = useReducer(httpReducer, {isLoading: false, error:null});

  const onAddIngredient = ingredient => {
    httpDispatch({type:'SEND'});
    fetch('https://react-hooks-update-6d16f.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    })
    .then((response)=> {httpDispatch({type:'RESPONSE'}); return response.json()})
    .then( responseBody => dispatch({type: 'ADD', ingredient: {id: responseBody.name, ...ingredient}}));
    }
      
  useEffect(()=> {
    console.log('RENDERING INGREDIENTS...', userIngredients);

  }, userIngredients);

  const onRemoveIngredient = deletedIngredientId => {
    httpDispatch({type: 'SEND'});
    fetch(`https://react-hooks-update-6d16f.firebaseio.com/ingredients/${deletedIngredientId}.json`,{
      method: 'DELETE'
    }).then((response)=> {
      httpDispatch({type: 'RESPONSE'});
      dispatch({type:'DELETE', id: deletedIngredientId});
    }).catch((error) => {httpDispatch({type:'ERROR', errorMessage:'Something went wrong... :/'});})
  }

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []);

  const clearError = ()=> {
    httpDispatch({type:'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm  AddIngredient={onAddIngredient} loading={httpState.isLoading}/>
      <section>
        <Search OnFilteredIngredients= {filteredIngredientsHandler}/>
      <IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient}/>
      </section>
    </div>
  );
}

export default Ingredients;
