import DateTimePicker from 'react-datetime-picker';
import React, { useState } from "react";
import axios from 'axios'
import cheerio from 'cheerio'
//왕복 편도
//출발지 도착지


export function InputTravelData(){
    const [isRoundTrip, setIsRountTrip] = useState(true)
    const destinationList = [{
        ICN: '인천',
        GMP: '김포',
        HND: '도쿄(하네다)',
        NRT: '도쿄(나리타)',
        KIX: '오사카',
        FUK: '후쿠오카',
        OKA: '오키나와',
        CTS: '삿포로',
    }]

    const [departurePoint, setDeparturePoint] = useState('ICN');
    const [arrivalPoint, setArrivalPoint] = useState('HND');

    const [departureDate, setDepartureDate] = useState(new Date());
    const [arrivalDate, setArrivalDate] = useState(new Date());

    //https://flight.naver.com/flights/international/{출발지}-{도착지}-{20221202}?{adult}=1&{isDirect=true}
    //https://flight.naver.com/flights/international/{SEL}-{CTS}-{20221202}/{CTS}-{SEL}-{20221207}?adult=1&isDirect=true&fareType=Y

    function changeDateFormat(date){
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        console.log( `${year}${month}${day}`)
        return `${year}${month}${day}`
    }

    async function crawlingAirlineTicketData(){
        console.log(departureDate)
        try {
            const airlineTicketListHTML = isRoundTrip 
                ? await axios.get(`https://flight.naver.com/flights/international/${departurePoint}-${arrivalPoint}-${departureDate}/${arrivalPoint}-${departurePoint}-${arrivalDate}?adult=1&isDirect=true&fareType=Y`) 
                : await axios.get(`https://flight.naver.com/flights/international/${departurePoint}-${arrivalPoint}-${changeDateFormat(departureDate)}?adult=1&isDirect=true`) 

            const $airlineTicketList = cheerio.load(airlineTicketListHTML)
            console.log($airlineTicketList)
        } catch(err){
            console.log(err)
        }
    }

    return(
        <div>
            <div>
                {/* <button onClick={e=> console.log(isRoundTrip)}></button> */}
                <label>왕복</label>
                <input type='radio' name="isRoundTrip" checked={isRoundTrip} onChange={e=> setIsRountTrip(true)} />
                <label>편도</label>
                <input type='radio' name="isRoundTrip" checked={!isRoundTrip} onChange={e=> setIsRountTrip(false)}/>
            </div>
            <div>
                <label>출발지</label>
                <select id="Departure" onChange={e=> setDeparturePoint(e.target.value)}>
                    {destinationList.map(destination => {
                        return Object.entries(destination).map(([key, value]) => {
                            return (<option value={key}>{value}</option>)
                        })
                    })}
                </select>
                <label>도착지</label>
                <select id="Arrival" onChange={e=> setArrivalPoint(e.target.value)}>
                    {destinationList.map(destination => {
                        return Object.entries(destination).map(([key, value]) => {
                            return (<option value={key}>{value}</option>)
                        })
                    })}
                </select>
            </div>
            <div>
                <label>가는 날</label>
                <DateTimePicker onChange={setDepartureDate} value={departureDate} />
                <label>오는 날</label>
                <DateTimePicker onChange={setArrivalDate} value={arrivalDate} />
            </div>
            <div onClick={crawlingAirlineTicketData}>
                조회
            </div>
        </div>
    )
}