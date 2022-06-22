import { useEffect, useState } from 'react';
import MeetupList from "../comps/meetups/MeetupList";

function AllMeetupsPage() {
  const [isLoading, setIsLoading] = useState( true );
  const [loadedMeetups, setLoadedMeetups] = useState( [] );

  useEffect( () => {
    setIsLoading(true);
    fetch(
      'https://react-midapp-default-rtdb.firebaseio.com/meetups.json',
    )
      .then( res => res.json())
      .then( data => {
        const meetups = [];

        for (const key in data) {
          const meetup = {
            id: key,
            ...data[key]
          };

          meetups.push(meetup);
        }

        setIsLoading(false);
        setLoadedMeetups(meetups);
      });
  }, [] );

    if (isLoading) {
      return (
        <section>
          <p>Loading...</p>
        </section>
      );
    }

    return (
        <section>
            <h1>All Meetups</h1>
            <MeetupList meetups={loadedMeetups} />
        </section>
    );
}

export default AllMeetupsPage;