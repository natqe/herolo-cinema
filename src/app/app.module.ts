import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MoviesComponent } from './movies/movies.component'
import { HttpModule } from '@angular/http'
import { MatCardModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material'
import { MovieComponent } from './movie/movie.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { EditMovieComponent } from './edit-movie/edit-movie.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DeleteMovieComponent } from './delete-movie/delete-movie.component';
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component'

@NgModule({
  declarations: [
    AppComponent,
    MoviesComponent,
    MovieComponent,
    EditMovieComponent,
    DeleteMovieComponent,
    AddNewMovieComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    EditMovieComponent,
    DeleteMovieComponent
  ]
})
export class AppModule { }
