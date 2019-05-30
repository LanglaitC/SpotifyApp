import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiConnexionService {

  constructor(
    private http: HttpClient
  ) { }

  _currentAuth: {
    access_token: String;
    token_type: String
    expires_in: Number;
    state: any;
  } = { access_token: "", token_type: "", expires_in: 0, state: ''};
  get currentAuth() {
    if (localStorage.currentAuth)
      this._currentAuth = JSON.parse(localStorage.currentAuth)
    return this._currentAuth;
  }

  set currentAuth(value) {
    localStorage.currentAuth = JSON.stringify(value);
    this._currentAuth = value;
  }

  parseFragments(fragment: string) {
    fragment.split('&').forEach(elmt => {
      const keyVal = elmt.split('=')
      this.currentAuth[keyVal[0]] = keyVal[1];
      
    })
  }

  getInfo(type: 'tracks' | 'artists', time_range: 'medium_term' | 'long_term' | 'short_term') {
    const headers = new HttpHeaders({'Content-Type' : 'application/json', 'Authorization': `Bearer ${this.currentAuth.access_token}`});
    return this.http.get(`https://api.spotify.com/v1/me/top/${type}`, { headers , params: { limit: "50", time_range }})
  }
}
