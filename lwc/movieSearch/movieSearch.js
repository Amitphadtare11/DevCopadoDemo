import { LightningElement, wire } from 'lwc';

// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

const DELAY = 300;

export default class MovieSearch extends LightningElement {

delayeTimeout;
selectedType = '';
searchedMovie = '';
selectedPageNo = '1';
loadingSearch = false;
searchResult = [];
selectedmovie = '';

@wire(MessageContext)
    messageContext;

get options() {
    return [
        { label: '--None--', value: '' },
        { label: 'movie', value: 'movie' },
        { label: 'series', value: 'series' },
        { label: 'episode', value: 'episode' },
    ];
}

handleChange(event) {
    let {name, value} = event.target;
    this.loadingSearch = true;
    if (name === 'Type') {
        this.selectedType = value;
    }else if (name === 'search') {
        this.searchedMovie = value;
    }else if (name === 'pageno') {
        this.selectedPageNo = value;
    }
    
    clearTimeout(this.delayeTimeout);
    this.delayeTimeout = setTimeout(() => {
        this.searchMovie();
    }, DELAY);
        
    
}

async searchMovie(){

    const url = `http://www.omdbapi.com/?s=${this.searchedMovie}&type=${this.selectedType}&page=${this.selectedPageNo}&apikey=a0256159`;
    //const url = 'http://www.omdbapi.com/?s=Batman&type=&page=1&apikey=a0256159';
    console.log('Response from url',url);
    const res = await fetch(url);
    const data  = await res.json();

    console.log('Response from API',data);
    this.loadingSearch = false;

    if(data.Response === 'True'){
        this.searchResult = data.Search;
    }
}

get displaySearchResult(){
    return this.searchResult.length > 0 ? true : false;
}

handelTileClick(event){
    this.selectedmovie = event.detail;

    const payload = { movieID: this.selectedmovie};
    publish(this.messageContext, MOVIE_CHANNEL, payload);
}

}