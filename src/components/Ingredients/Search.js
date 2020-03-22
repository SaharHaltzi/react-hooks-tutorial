import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

  const [filteredInput, setFilteredInput] = useState('');
  const {OnFilteredIngredients} = props;

  useEffect(()=> {
    const query = filteredInput.length == 0 ? '' : `?orderBy="title"&equalTo="${filteredInput}"`
    fetch('https://react-hooks-update-6d16f.firebaseio.com/ingredients.json' + query)
    .then( (response) => response.json())
    .then((responseData)=> {
      const loadedIngredients = [];
      for(const key in responseData)
      {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
      }
      OnFilteredIngredients(loadedIngredients);
    })
  },[filteredInput, OnFilteredIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" value={filteredInput} onChange = {(event)=>{setFilteredInput(event.target.value)}}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
