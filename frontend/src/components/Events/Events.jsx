import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../styles/styles';
import EventCard from './EventCard';
import { getAllEvents } from '../../redux/actions/event';
import { Oval } from 'react-loader-spinner';

const Events = () => {
  const dispatch = useDispatch();
  const { allEvents, isLoading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  return (
    <div>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Oval color="#00BFFF" height={80} width={80} />
        </div>
      ) : allEvents && allEvents.length !== 0 ? (
        <div className={styles.section}>
          <div className={styles.heading}>
            <h1>Popular Events</h1>
          </div>
          <div className="flex overflow-x-auto space-x-4 snap-x snap-mandatory hide-scrollbar">
            {allEvents.map((event) => (
              <div className="snap-center shrink-0 w-full md:w-1/2" key={event._id}>
                <EventCard data={event} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default Events;
