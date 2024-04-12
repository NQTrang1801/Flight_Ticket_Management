interface IMovie {
    name: string;
    duration: number;
    description: string;
    trailerLink: string;
    releaseDate: Date;
    nation: string;
    director: string;
    moviePosters: Array<IMoviePosters>;
}

interface IMovieData {
    name: string;
    duration: number;
    description: string;
    trailerLink: string;
    releaseDate: Date;
    nation: string;
    director: string;
    moviePosters: Array<IMoviePosters>;
    id: string;
}

interface IMoviePosters {
    base64?: File;
    isThumb: boolean;
    link: string;
}

interface IActors {
    fullName: string;
    id: string;
    profilePicture: string;
}

interface IActor {
    fullName: string;
    dateOfBirth: Date;
    biography: string;
    nationality: string;
}

interface Movie {
    id: string;
    name: string;
    director: string;
    moviePosters: Array<{ id: number; link: string; isThumb: boolean }>;
}

interface IMovieData {
    avrStars: number;
    description: string;
    director: string;
    duration: number;
    id: string;
    isActive: boolean;
    name: string;
    nation: string;
    releaseDate: string;
    reviews: [];
    totalReviews: string;
    trailerLink: string;
    moviePosters: Array<{
        link: string;
        isThumb: boolean;
        id: string;
    }>;
    movieCategories: Array<{
        id: string;
        movieId: string;
        categoryId: string;
        category: { name: string };
    }>;
    movieParticipants: Array<{
        id: string;
        movieId: string;
        profession: string;
        peopleId: string;
        people: {
            fullName: string;
            profilePicture: string;
            nationality: string;
        };
    }>;
}

interface IActorData {
    fullName: string;
    dateOfBirth: string;
    biography: string;
    nationality: string;
    id: string;
    gender: string;
    profilePicture: string;
    movieParticipants: Array<{ id: string; movieId: string; peopleId: string }>;
}

interface IActorValidation {
    fullName: string;
    dateOfBirth: Date;
    biography: string;
    nationality: string;
}

interface INews {
    id: string;
    title: string;
    shortDesc: string;
    newsPictures: [
        {
            id: string;
            link: string;
            newsId: string;
        }
    ];
}

interface INewsValidation {
    title: string;
    shortDesc: string;
    fullDesc: string;
    base64NewsPictures: File[];
}

interface INewsData {
    id: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    newsPictures: [
        {
            id: string;
            link: string;
            newsId: string;
        }
    ];
    createdAt: Date;
}

interface ITheaters {
    id: string;
    name: string;
    city: string;
    address: string;
    rooms: [
        {
            id: string;
            name: string;
            capacity: string;
            type: string;
            theaterId: string;
            showings: [{ id: string; startTime: string; endTime: string; movieId: string; roomId: string }];
        }
    ];
}

interface ITheatersValidation {
    name: string;
    city: string;
    address: string;
}

interface IRooms {
    id: string;
    name: string;
    capacity: string;
    type: string;
    theaterId: string;
}

interface IRoomsValidation {
    name: string;
    type: string;
}

interface IRoomData {
    id: string;
    name: string;
    capacity: string;
    type: string;
    theaterId: string;
    theater: {
        id: string;
        name: string;
        city: string;
        address: string;
    };
}

interface ISeats {
    id: string;
    seatRow: string;
    seatColumn: string;
    type: string;
    pairWith: string | null;
    roomId: string;
}

interface ISeatsValidation {
    numberOfRow: string;
    numberOfColumn: string;
}

interface ISeatData {
    roomId: string;
    numberOfRow: string;
    numberOfColumn: string;
    seatType: string;
    pairWith: string;
}

interface IShows {
    id: string;
    startTime: string;
    endTime: string;
    movieId: string;
    roomId: string;
    room: {
        id: string;
        name: string;
        capacity: string;
        type: string;
        theaterId: string;
    };
    movie: {
        id: string;
        name: string;
        duration: number;
        description: string;
        trailerLink: string;
        releaseDate: string;
        nation: string;
        totalReviews: string;
        avrStars: number;
        isActive: boolean;
        director: string;
        moviePosters: [
            {
                id: string;
                link: string;
                movieId: string;
                isThumb: boolean;
            }
        ];
    };
    showingSeats: Array<{
        id: string;
        seatRow: string;
        seatColumn: string;
        type: string;
        roomId: string;
        price: string;
        isBooked: boolean;
        pairWith: null | string;
    }>;
}

interface IShowsValidation {
    startTime: Date;
}

interface IBookings {
    id: string;
    totalPrice: number;
    status: string;
    userId: string;
    showingId: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        gender: string;
        profilePicture: null;
        phoneNumber: string;
        address: string;
        dateOfBirth: string;
        roleId: string;
    };
    showing: {
        id: string;
        startTime: string;
        endTime: string;
        movieId: string;
        roomId: string;
        movie: IMovie;
        room: {
            name: string;
            type: string;
            theater: {
                id: string;
                name: string;
                city: string;
                address: string;
            };
        };
    };
    showingSeats: [
        {
            id: string;
            type: string;
            price: number;
            showingId: string;
            seatId: string;
            bookingId: string;
            seat: {
                id: string;
                seatRow: string;
                seatColumn: string;
                type: string;
                pairWith: null | string;
                roomId: string;
            };
        }
    ];
}
