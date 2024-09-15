interface Trip {
    id: number;
    destination: string[];
    start_date: string;
    budget: number;
    interests: string[];
    duration: number;
    itineraries: {
        destination: string;
        budget: number;
        duration: number;
        itinerary: {
            day: number;
            activities: {
                name: string;
                cost: number;
                description: string;
            }[];
        }[];
    }[];
    favorite: boolean;
}

export default Trip;