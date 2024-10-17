const express = require ('express');
const app = express();
const {graphqlHTTP} = require('express-graphql'); 

const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLString, GraphQLInt, GraphQLFloat } = require('graphql');

const directors = [
  {id: 1, name: 'Christopher Nolan', age: 50  },
  {id: 2, name: 'Quentin Tarantino', age: 55},
  {id: 3, name: 'Steven Spielberg', age: 60},
  {id: 4, name: 'James Cameron', age: 65},
  {id: 5, name: 'Stanley Kubrick', age: 70},
  {id: 6, name: 'Alfred Hitchcock', age: 75},
  {id: 7, name: 'David Lynch', age: 80},
  {id: 8, name: 'David Fincher', age: 85}, 
  {id: 9, name: 'Martin Scorsese', age: 90},
  {id: 10, name: 'Francis Ford Coppola', age: 95},
  {id: 11, name: 'Orson Welles', age: 100},
  {id: 12, name: 'Ingmar Bergman', age: 105},
  {id: 13, name: 'Akira Kurosawa', age: 110},
  {id: 14, name: 'Federico Fellini', age: 115},
  {id: 15, name: 'Clint Eastwood', age: 120},
  {id: 16, name: 'John Ford', age: 125},  
  {id: 17, name: 'Akira Kurosawa', age: 130},
  {id: 18, name: 'Federico Fellini', age: 135},
  {id: 19, name: 'Clint Eastwood', age: 140},
  {id: 20, name: 'John Ford', age: 145},
]

const movies = [
  {id: 1, name: 'Interstellar', directorId: 1, genre: 'Sci-Fi', rating: 8.8 },
  {id: 2, name: 'The Dark Knight', directorId: 1, genre: 'Action', rating: 9.0},
  {id: 3, name: 'Inception', directorId: 1, genre: 'Thriller', rating: 8.8},
  {id: 4, name: 'The Matrix', directorId: 1, genre: 'Sci-Fi', rating: 8.7},
  {id: 5, name: 'The Shawshank Redemption', directorId: 2, genre: 'Drama', rating: 9.3},
  {id: 6, name: 'The Godfather', directorId: 2, genre: 'Crime', rating: 9.2},
  {id: 7, name: 'The Godfather: Part II', directorId: 2, genre: 'Crime', rating: 9.0},
  {id: 8, name: 'The Godfather: Part III', directorId: 2, genre: 'Crime', rating: 7.4},
  {id: 9, name: 'Psycho', directorId: 3, genre: 'Thriller', rating: 8.5},
  {id: 10, name: 'Schindler\'s List', directorId: 3, genre: 'Drama', rating: 8.9},
  {id: 11, name: 'Saving Private Ryan', directorId: 3, genre: 'War', rating: 8.6},
  {id: 12, name: 'Avatar', directorId: 4, genre: 'Sci-Fi', rating: 7.9},
  {id: 13, name: 'Titanic', directorId: 4, genre: 'Romance', rating: 7.8},
  {id: 14, name: 'The Silence of the Lambs', directorId: 5, genre: 'Thriller', rating: 8.6},
  {id: 15, name: 'The Lord of the Rings: The Fellowship of the Ring', directorId: 5, genre: 'Adventure', rating: 8.8},
  {id: 16, name: 'The Lord of the Rings: The Return of the King', directorId: 5, genre: 'Adventure', rating: 8.9},
  {id: 17, name: 'The Lord of the Rings: The Two Towers', directorId: 5, genre: 'Adventure', rating: 8.7},
  {id: 18, name: 'The Lord of the Rings: The Fellowship of the Ring', directorId: 5, genre: 'Adventure', rating: 8.8},
  {id: 19, name: 'The Lord of the Rings: The Return of the King', directorId: 5, genre: 'Adventure', rating: 8.9},
  {id: 20, name: 'The Lord of the Rings: The Two Towers', directorId: 5, genre: 'Adventure', rating: 8.7},
] 


 const movieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type:  GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    directorId: {type: GraphQLNonNull(GraphQLInt)},
    genre: {type: GraphQLString},
    director: {
      type: directorType,
      resolve: (movie) => directors.find(director => director.id === movie.directorId)
    },
    rating: {type: GraphQLNonNull(GraphQLFloat)}
  })
 });

 const directorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: {type: GraphQLNonNull(GraphQLInt)},
    name: {type: GraphQLNonNull(GraphQLString)},
    movies: {
      type: new GraphQLList(movieType),
      resolve: (director) => movies.filter(movie => movie.directorId === director.id)
    },
    age: {type: GraphQLNonNull(GraphQLInt)}
  })
 });


 const queryType = new GraphQLObjectType({
  name: 'MoviesQuery',
  description: 'This represents the query of Movies and their Directors',
  fields: () => ({
    movie: {
      type: movieType,
      description: 'This will return a single movie',
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, args) => movies.find(movie => movie.id === args.id)
    },
    director: {
      type: directorType,
      description: 'This will return a single director',
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, args) => directors.find(director => director.id === args.id)
    },
    movies: {
      type: new GraphQLList(movieType),
      description: 'This will return all the movies',
      resolve: () => movies
    },
    directors: {
      type: new GraphQLList(directorType),
      description: 'This will return all the directors',
      resolve: () => directors
    }
  })
 });

 const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addMovie: {
      type: movieType,
      args: {
        name: {type: GraphQLNonNull(GraphQLString)},
        directorId: {type: GraphQLNonNull(GraphQLInt)},
        genre: {type: GraphQLString},
        rating: {type: GraphQLNonNull(GraphQLFloat)}
      },
      resolve: (_, args) => {
        const newMovie = {
          id: movies.length + 1,
          name: args.name,
          directorId: args.directorId,
          genre: args.genre,
          rating: args.rating
        };
        movies.push(newMovie);
        return newMovie;
      }
    },
    updateMovie: {
      type: movieType,
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLString},
        directorId: {type: GraphQLInt},
        genre: {type: GraphQLString},
        rating: {type: GraphQLFloat}
      },
      resolve: (_, args) => {
        const movieIndex = movies.findIndex(movie => movie.id === args.id);
        if (movieIndex === -1) {
          throw new Error('Movie not found');
        }
        movies[movieIndex] = {
          ...movies[movieIndex],
          ...args
        };
        return movies[movieIndex];
      }
    },
    deleteMovie: {
      type: movieType,
      args: {
        id: {type: GraphQLNonNull(GraphQLInt)}
      },
      resolve: (_, args) => {
        const movieIndex = movies.findIndex(movie => movie.id === args.id);
        if (movieIndex === -1) {
          throw new Error('Movie not found');
        }
        const deletedMovie = movies.splice(movieIndex, 1);
        return deletedMovie[0];
      }
    }
  })
});
 

const moviewSchema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType
});


app.use('/graphql', graphqlHTTP({
  graphiql: true,
  schema: moviewSchema
}));


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
