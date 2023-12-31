import { Badge, Box, Button, Container, HStack, Img, Progress, Radio, RadioGroup, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useState ,useEffect} from 'react'
import Loader from "./Loader"
import {useParams} from "react-router-dom"
import axios from 'axios'
import { server } from '../index';
import Error from './Error'
import Chart from './Chart'

const CoinDetails = () => {
        
        const [coin,setCoin]=useState({});
        const [loading,setLoading]=useState(true);
        const [error,setError]=useState(false)
        const [currency,setCurrency]=useState("inr");
        const [days,setDays]=useState("24h");
        const [chartArray,setChartArray]=useState([]);
        const params=useParams()



        

        const currencySymbol=currency==="inr"?"₹":currency==="eur"?"€":"$";

        const btns=["24h","7d","14d","30d","60d","200d","1yr","max"]
        // chart btn array

        const switchChartStats=(key)=>{
             switch (key) {
              case "24h":
                setDays("24h");
                setLoading(true);
                break;

              case "7d":
                setDays("7d");
                setLoading(true);
                break;
                
              case "14d":
                setDays("14d");
                setLoading(true);
                break;

              case "30d":
                setDays("30d");
                setLoading(true);
                break;

              case "60d":
                setDays("60d");
                setLoading(true);
                break;

              case "200d":
                setDays("200d");
                setLoading(true);
                break;

              case "1yr":
                setDays("365d");
                setLoading(true);
                break;

              case "max":
                setDays("max");
                setLoading(true);
                break;



             
              default:
                setDays("24h");
                setLoading(true);
                break;
             }
        }


        

        useEffect(() => {
     const fetchCoin=async()=>{
        try {
            const{data}=await axios.get(`${server}/coins/${params.id}`);
            const {data:chartData}=await axios.get(`${server}/coins/${params.id}/market_chart?vs_currency=${currency}&days=${days}`);
            // here data:chartData means im taking data as chart data because of naming collision
          
           setCoin(data);
           setChartArray(chartData.prices);
          
           setLoading(false);
        } catch (error) {
            
            setLoading(false);
            setError(true);
        }
     };
     
     fetchCoin();
     
     
   }, [params.id,currency,days])

   if(error){
     return <Error message={"error while fetching coin details"}/>
   } 



  return (
    <Container maxW={'container.xl'}>
       {
        loading?<Loader/>:(
          <>
            <Box w={'full'} borderWidth={'1'}>
                 <Chart arr={chartArray} currency={currencySymbol}  days={days}/>
            </Box>

            {/* Buttons for chart */}
            <HStack wrap={'wrap'} p={'4'}>
               
               {
                btns.map((i)=>(
                  <Button key={i} onClick={()=>switchChartStats(i)}>{i}</Button>
                ))
               }
       
            </HStack>


           <RadioGroup value={currency} onChange={setCurrency} p={'8'}>
            
            <HStack spacing={'4'}>
                <Radio  value='inr'>INR</Radio>
                <Radio value='eur'>EUR</Radio>
                <Radio value='usd'>USD</Radio>
            </HStack>

           </RadioGroup>


           {/* main work start */}

           <VStack spacing={'4'} p={'16'} alignItems={'flex-start'}>
             <Text fontSize={'small'} alignSelf={'center'} opacity={'0.7'} fontWeight={'bold'}>
               Last updated on {Date(coin.market_data.last_updated).split("G")[0]}
             </Text>
             
             <Img src={coin.image.large} w={'16'} h={'16'} objectFit={'contain'}/>

             <Stat>
               <StatLabel>{coin.name}</StatLabel>
               <StatNumber>{currencySymbol}{coin.market_data.current_price[currency]}</StatNumber>

               <StatHelpText>
               <StatArrow
                type={coin.market_data.price_change_percentage_24h>0?"increase":"decrease" }/>
                 {coin.market_data.price_change_percentage_24h }%
               </StatHelpText>
             </Stat>



            {/* for showing the rank */}
             <Badge fontSize={"2xl"}
                    bgColor={"blackAlpha.800"}
                    color={"white"}
              >
               {`#${coin.market_cap_rank}`}
             </Badge>


             <CustomBar high={`${currencySymbol}${coin.market_data.high_24h[currency]}`}
                         low={`${currencySymbol}${coin.market_data.low_24h[currency]}`}/>


             <Box w={'full'} p={'4'}>
                <Item title={"Max Supply"} value={coin.market_data.max_supply}/>
                <Item title={"Curr-Market Supply"} value={coin.market_data.circulating_supply}/>
                <Item title={"Market-Capital"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}/>
                <Item title={"Market-Capital"} value={`${currencySymbol}${coin.market_data.market_cap[currency]}`}/>
                <Item title={"All Time Low"} value={`${currencySymbol}${coin.market_data.atl[currency]}`}/>
                <Item title={"All Time High"} value={`${currencySymbol}${coin.market_data.ath[currency]}`}/>
                {/* market cap is total value of available coins in market */}
                {/* max supply means maximum no of coins available in future */}
             </Box>


           </VStack>
          </>
        )

        
       }
    </Container>
  )
}


const CustomBar=({high,low})=>(
  <VStack w={'full'}>
     <Progress value={0} colorScheme='teal'  w={'full'}/>
     <HStack justifyContent={'space-between'} w={'full'}>
        
        <Badge children={low} colorScheme='red'></Badge>
        <Text fontSize={'sm'} fontWeight={'bold'}>Last 24H Range</Text>
        <Badge children={high} colorScheme='green'></Badge>



     </HStack>
  </VStack>
)

const Item=({title,value})=>(
   <HStack justifyContent={'space-between'} w={'full'} my={'4'}>
   {/* my is vertical margin */}
     <Text fontFamily={'Bebas Neue'} letterSpacing={'widest'}>{title}</Text>
     <Text>{value}</Text>
   </HStack>
)

export default CoinDetails