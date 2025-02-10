import { LightningElement, wire } from 'lwc';
// Import message service features required for subscribing and the message channel
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from 'lightning/messageService';
import MOVIE_CHANNEL from '@salesforce/messageChannel/movieChannel__c';

export default class MovieDetail extends LightningElement {

    subscription;
    movieDetails = {};
    isLoaded = false;
    
    @wire(MessageContext)
    messageContext;

     // Standard lifecycle hooks used to subscribe and unsubsubscribe to the message channel
     connectedCallback() {
        this.subscribeToMessageChannel();
    }

    disconnectedCallback() {
        this.unsubscribeToMessageChannel();
    }

    // Encapsulate logic for Lightning message service subscribe and unsubsubscribe
    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                MOVIE_CHANNEL,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    unsubscribeToMessageChannel() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    handleMessage(message) {
        let movieId = message.movieID;
        console.log('MESSAGE RECEIVED: ', movieId);
        this.getMovieDetails(movieId);
    }

    async getMovieDetails(movieId) {
        const url = `http://www.omdbapi.com/?i=${movieId}&plot=full&apikey=a0256159`;
        const response = await fetch(url);
        const data = await response.json();
        this.movieDetails = data;
        this.isLoaded = true;
        console.log('MOVIE DETAILS: ', this.movieDetails);
    }
    



}