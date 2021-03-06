import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MoviesComponent } from './movies/movies.component'
import { HttpClientModule } from '@angular/common/http'
import { MatCardModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatToolbarModule, MatProgressSpinnerModule } from '@angular/material'
import { MovieComponent } from './movie/movie.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { EditMovieComponent } from './edit-movie/edit-movie.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DeleteMovieComponent } from './delete-movie/delete-movie.component'
import { AddNewMovieComponent } from './add-new-movie/add-new-movie.component'
import { NgxsModule } from '@ngxs/store'
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin'
import { MoviesState } from './movies/movies.state'
import { NgxsEmitPluginModule } from '@ngxs-labs/emitter'

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
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    FlexLayoutModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    NgxsModule.forRoot([ MoviesState ], {
      developmentMode: true
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({}),
    NgxsEmitPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    EditMovieComponent,
    DeleteMovieComponent
  ]
})
export class AppModule { }
