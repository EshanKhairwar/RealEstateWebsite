import asyncHandler from 'express-async-handler'
import {prisma} from "../config/prismaConfig.js"

export const createUser=asyncHandler(async(req,res)=>{
    console.log("creating a user")

    let {email}=req.body;
    const userExists=await prisma.user.findUnique({where:{email:email}})
    if(!userExists){
        const user=await prisma.user.create({data:req.body})
        res.send({
            message:"User Registered Successfully",
            user:user,
        })
    }
    else{
        res.status(201).send({message:'User Already Registered'})
    }
})

// function to book to visit residency

export const bookVisit=asyncHandler(async(req,res)=>{
    const {email,date}=req?.body;
    const {id}=req?.params
    try{
    const alreadyBooked=await prisma?.user?.findUnique({
        where:{email},
        select:{bookedVisits:true}
    })
    if(alreadyBooked.bookedVisits?.some((visit)=>visit?.id ===id)){
        res.status(400).json({message:"This residency is already booked by you!!!"})
    }
    else{
        await prisma?.user?.update({
            where:{email:email},
            data:{
                bookedVisits:{push:{id,date}}
            }
        })
        res.send("Your visit is Booked Successfully!!!")
    }
    }
    catch(error){
        throw new Error(error.message)
    }
})

// Get all bookings

export const getAllBookings=asyncHandler(async(req,res)=>{
const {email}=req.body

try {
    const bookings=await prisma?.user?.findUnique({
        where:{email},
        select:{bookedVisits:true}
    })
    res.status(200).send(bookings)
} catch (error) {
    throw new Error(error.message)
}
})

//Cancel all bookings

export const cancelBooking=asyncHandler(async(req,res)=>{

const {email}=req?.body;
const {id}=req?.params;


try{
const user=await prisma.user.findUnique({
    where:{email:email},
    select:{bookedVisits:true}
})

const index=user.bookedVisits.findIndex((visit)=>visit.id===id)

if(index===-1){
    res.status(404).json({message:"Booking Not Found"})
}
else{
    user.bookedVisits.splice(index,1)
    await prisma.user.update({
        where:{email:email},
        data:{
            bookedVisits:user.bookedVisits
        }
    })
    res.send("Booking Cancelled Successfully!!!")
}
}
catch(err){
    throw new Error(err.message)
}

})

//Add Residencies in Favourite List of a User

export const toFav=asyncHandler(async(req,res)=>{
    const {email}=req?.body;
    const {rid}=req?.params;

    try {
        const user=await prisma?.user?.findUnique({
            where:{email:email}
        })
        if(user.favResidenciesID.includes(rid)){
            const updateUser=await prisma?.user?.update({
                where:{email:email},
                data:{
                    favResidenciesID:{
                        set:user.favResidenciesID.filter((id)=>id!==rid)
                    }
                }
            })
            res.send({message:"Removed From Favourites",user:updateUser})
        }
        else{
            const updateUser=await prisma.user.update({
                where:{email:email},
                data:{
                    favResidenciesID:{
                        push:rid
                    }
                }
            })
            res.send({message:"Updated Favourites",user:updateUser})
        }
    } catch (error) {
        throw new Error(error.message)
    }
})

// Read All Favourites

export const getAllFavourites=asyncHandler(async(req,res)=>{
    const {email}=req.body;

    try{
        const favResd=await prisma.user.findUnique({
            where:{email:email},
            select:{favResidenciesID:true}
        })
        res.status(200).send(favResd)
    }
    catch(err){

    }
})
