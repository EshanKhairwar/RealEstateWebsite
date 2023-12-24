import { Modal,Button } from '@mantine/core'
import {DatePicker} from '@mantine/dates'

import React, { useContext, useState } from 'react'
import { useMutation } from 'react-query';

import UserDetailContext from '../../context/UserDetailContext';
import { bookVisit } from '../../utils/api';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const BookingModal = ({opened,setOpened,email,propertyId}) => {
  const [value,setValue]=useState(null);
  const {userDetails,setUserDetails}=useContext(UserDetailContext)
//   console.log(token)
const handleBookingSuccess=()=>{
    toast.success("You have Booked Your Visit",{position:"bottom-right"});
    setUserDetails((prev)=>({
        ...prev,
        bookings:[
            ...prev.bookings,
            {
                id:propertyId,date:dayjs(value).format('DD/MM/YYYY')
            }
        ]
    }))
};
  const {mutate,isLoading}=useMutation({
    mutationFn:()=>bookVisit(value,propertyId,email),
    onSuccess:()=>handleBookingSuccess(),
    onError:({response})=>toast.error(response.data.message),
    onSettled:()=>setOpened(false)
  })
  return ( 
 

   <Modal
   opened={opened}
   onClose={()=>setOpened(false)}
   title="Select your date of visit"
   centered>
    <div className="flexColCenter" style={{gap:"1rem"}}>
        <DatePicker value={value} onChange={setValue} minDate={new Date()}/>
        <Button disabled={!value || isLoading} onClick={()=>mutate()}>Book your Visit</Button>
    </div>


   </Modal>
      
  )
}

export default BookingModal