'use client'
import Image from "next/image";
import Navbar from "./component/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, formatDistanceStrict, formatDistanceToNow, formatDistanceToNowStrict, formatISO, parseISO } from "date-fns";
import { formatDistance } from "date-fns/fp";

type WeatherData = {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherForecast[];
  city: CityInfo;
};

type WeatherForecast = {
  dt: number;
  main: MainWeather;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  rain?: Rain;
  sys: SystemInfo;
  dt_txt: string;
};

type MainWeather = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
};

type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type Clouds = {
  all: number;
};

type Wind = {
  speed: number;
  deg: number;
  gust: number;
};

type Rain = {
  "3h": number;
};

type SystemInfo = {
  pod: string;
};

type CityInfo = {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

type Coordinates = {
  lat: number;
  lon: number;
};

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>('repoData', 
  async () => {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=2` 
    );
    return data;
    }
  );

const FirstData = data?.list[0]

  console.log("data", data);

  if (isLoading) return (
   <div className="flex items-center min-h-screen justify-center" >
    <p className="animate-bounce">'Loading...'</p>
   </div>
  );
  

  return (
  <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
    <Navbar />
    <main className="px-3 max-w-7xl mx-auto flax flex-col gap-9 w-full pb-10 pt-4">
      <section>
        <div>
          <h2 className="flex gap-1 text-2xl items-end">
            <p> {format(parseISO(FirstData?.dt_txt ?? ""), "EEEE")} </p> 

          </h2>
        </div>
      </section>
      <section></section>
    </main>
  </div>
  );
}
