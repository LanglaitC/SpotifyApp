import { Component, OnInit } from '@angular/core';
import { ApiConnexionService } from '../api-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CLIENT_ID, RESPONSE_TYPE, REDIRECT_URL, SCOPE_URL } from '../constants';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private apiRoutingSvc: ApiConnexionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  results: {label: string, result: any, type: "artists" | "tracks"}[] = [];

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment === null) {
        this.redirect();
      } else if (fragment !== "") {
        this.apiRoutingSvc.parseFragments(fragment)
        forkJoin([
          this.apiRoutingSvc.getInfo("tracks", "short_term"),
          this.apiRoutingSvc.getInfo("tracks", "medium_term"),
          this.apiRoutingSvc.getInfo("tracks", "long_term"),
          this.apiRoutingSvc.getInfo("artists", "short_term"),
          this.apiRoutingSvc.getInfo("artists", "medium_term"),
          this.apiRoutingSvc.getInfo("artists", "long_term")
        ]).subscribe(res => {
          this.results.push({type: "tracks", label: 'Morceaux les plus ecoutes sur les 4 dernieres semaines', result: res[0]})
          this.results.push({type: "tracks", label: 'Morceaux les plus ecoutes sur les 6 derniers mois', result: res[1]})
          this.results.push({type: "tracks", label: 'Morceaux les plus ecoutes depuis toujours', result: res[2]})
          this.results.push({type: "artists", label: 'Artistes les plus ecoutes sur les 4 dernieres semaines', result: res[3]})
          this.results.push({type: "artists", label: 'Artistes les plus ecoutes sur les 6 derniers mois', result: res[4]})
          this.results.push({type: "artists", label: 'Artistes les plus ecoutes depuis toujours', result: res[5]})
          this.results.forEach(result => {
            if (result.type === 'tracks') {
              result.result.items.forEach(item => item.duration = this.formatDuration(item.duration_ms));
            } else {
              result.result.items.forEach(item => item.parsed_genres = item.genres.join(', '));
            }
          })
        },
        (err) => {
          if (err.status === 401 || err.status === 403) {
            this.redirect();
          }
        })
      }
    })
  }

  redirect() {
    window.location.href = "https://accounts.spotify.com/authorize?client_id=" + CLIENT_ID + "&response_type=" + RESPONSE_TYPE + "&redirect_uri=" + REDIRECT_URL + "&scope=" + SCOPE_URL;
  }

  formatDuration(duration: number) {
    const sec = duration / 1000;
    const modulo = Math.round(sec % 60)
    return Math.floor(sec / 60) + ":" + (modulo < 10 ? "0" : "") + modulo;
  }

}
