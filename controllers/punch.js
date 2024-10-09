const express = require("express");
const constants = require("../config/constant")
const subscriptionDao = require("../dao/subscriptionPlans");
const activeSubscriptionsDao = require("../dao/activeSubscriptions");
const attendenceDao = require("../dao/attendence");
const gymDao = require("../dao/gymDetails");
const userDao = require("../dao/user");

let punchIn = async (req, res) => {
    try {
        let is_manual = '0';
        if (req.file) {
            is_manual = '1';
        }

        let loggedInUser = req.loggedInUser;

        if (loggedInUser) {
            let allActiveSubscrptions = [];
            let activeSubscription = await activeSubscriptionsDao.getActiveSubscriptionsByUserId(loggedInUser.id);
            if(!activeSubscription){
                return res.status(400).json("No active subscription found");
            }
            
            if(activeSubscription > 1){
                allActiveSubscrptions = activeSubscription;
                activeSubscription = activeSubscription[0]; 
            }else{
                activeSubscription = activeSubscription[0];
            }
            
            let subscription = await subscriptionDao.findById(activeSubscription.fk_subscription_id);
            if(!subscription){
                return res.status(400).json("Subscription not found");
            }
            let gym = await gymDao.findById(subscription.fk_gym_id);

            if(parseFloat(activeSubscription.remaining_amount, 2) < parseFloat(gym.charges_per_entry, 2)){
                if(allActiveSubscrptions.length > 1){

                }else{
                    return res.status(400).json("Insufficient balance");
                }
            }

            if(!gym){
                return res.status(400).json("Gym not found");
            }
            

            let request = {
                fk_user_id: loggedInUser.id,
                fk_gym_id: gym.id,
                fk_gym_owner_id: gym.fk_gym_owner_id,
                is_manual: is_manual,
                fk_media_id: req.file ? req.file.filename : null,
                total_cost: parseFloat(gym.charges_per_entry).toFixed(2),
                location_link: req.body.location_link,
                fk_active_subscription_id: activeSubscription.id,
                is_active: '1'
            }

            let attendence = await attendenceDao.insert(request);

            console.log("request",request, "attendence", attendence);

            if(attendence){
                let reqActiveSubscription = {
                    remaining_amount: parseFloat(activeSubscription.remaining_amount) - parseFloat(gym.charges_per_entry).toFixed(2)
                }
                let updatedActiveSubscription = await activeSubscriptionsDao.patch(activeSubscription.id, reqActiveSubscription);
                if(updatedActiveSubscription){
                    return res.status(200).json("Punched in successfully");
                }
            }

        } else {
            
            return res.status(500).json(constants.error_messages[500]);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(constants.error_messages[500]);
    }
}

module.exports = {
    punchIn
}