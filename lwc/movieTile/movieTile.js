import { api, LightningElement } from 'lwc';

export default class MovieTile extends LightningElement {
    @api movie;
    @api selectedmovie;

    clickHandler(event) {
        console.log('Movie clicked',this.movie.Title);
        const evt = new CustomEvent("tileclick", {
            detail: this.movie.imdbID
        });

        this.dispatchEvent(evt);
    }

    get selectedtile(){
        return this.selectedmovie === this.movie.imdbID ? "tile highlightTile" : "tile";    
    }
}