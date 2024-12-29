import axios from 'axios';
import { BASE_URL } from './base';

const shopAddress = '01 Võ Vân Ngân, phường Linh Chiểu, Thủ Đức, Thành phố Hồ Chí Minh';

// Function to get distance from Google Distance Matrix API
export const getDistance = async (destination: string) => {
  try {
    const response = await axios.get(BASE_URL + '/distance', {
      params: {
        origins: shopAddress,
        destinations: destination,
      },
    });

    const duration = response.data.rows[0].elements[0].duration.value;
    const distanceInMeters = response.data.rows[0].elements[0].distance.value;
    const distanceInKilometers = distanceInMeters / 1000;
    
    return {duration, distanceInKilometers};
  } catch (error) {
    console.error('Error fetching distance from proxy server:', error);
    throw new Error('Unable to calculate distance');
  }
};
