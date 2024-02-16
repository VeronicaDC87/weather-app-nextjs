'use client'
import Image from "next/image";
import Navbar from "./component/Navbar";
import { useQuery } from "react-query";
import axios from "axios";
import { format, formatDistanceStrict, formatDistanceToNow, formatDistanceToNowStrict, formatISO, parseISO } from "date-fns";
import { formatDistance } from "date-fns/fp";
import Container from "./Container";
import { convertoKelvintoCelcius } from "./component/Utils/convertKelvintoCelcius";

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
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="flex gap-1 text-2xl items-end">
            <p> {format(parseISO(FirstData?.dt_txt ?? ""), "EEEE")} </p>
            <p className="text-lg"> ({format(parseISO(FirstData?.dt_txt ?? ""), "dd.MM.yyyy")}) </p> 

          </h2>
          <Container className="gap-10 px-6 items-centered">
            <div className="flex flex-col px-4 ">
            <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3 "></div>
              {data?.list.map((d,i) => (
                <div key={i}
                className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"></div>
              ))}  
            <span className="text-5-xl">
              {convertoKelvintoCelcius(FirstData?.main.temp ?? 296.37)}°
              </span>
              <p className="text-xs space-x-1 whitespace-nowrap">
              <span> Feels like </span>
              <span>
              {convertoKelvintoCelcius(FirstData?.main.feels_like ?? 0)}° 
              </span>
              </p>
              <p className="text-xs space-x-2">
              <span>
              {convertoKelvintoCelcius(FirstData?.main.temp_min ?? 0)}°↓ {" "} 
              </span>
              <span>
              {" "}
              {convertoKelvintoCelcius(FirstData?.main.temp_max ?? 0)}°↑  
              </span>
              </p>
            </div>
          </Container>
        </div>
      </section>
      <section></section>
    </main>
  </div>
  );
}
