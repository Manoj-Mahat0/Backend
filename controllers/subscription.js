const express = require("express");
const constants = require("../config/constant")
const subscriptionDao = require("../dao/subscriptionPlans");
const userDao = require("../dao/user");
const activeSubscriptionsDao = require("../dao/activeSubscriptions");

let addSubscription = async (req, res) => {
    try {
        let body = req.body;
        let gymOwnerId;
        if (req.loggedInUser.type === constants.user_type.ADMIN) {
            gymOwnerId = req.body.gymOwnerId;
            if (!gymOwnerId) {
                return res.status(400).json("Must Provide gym owner id");
            }
        } else {
            gymOwnerId = req.loggedInUser.id;
        }

        let request = {
            fk_user_id: gymOwnerId,
            name: body.name,
            tag: body.tag,
            price: parseFloat(body.price, 2),
            validity: parseInt(body.validity),
            validity_measure: body.validityMeasure[0],
            fk_gym_id: body.gymId,
            is_active: '1'
        }

        let subscription = await subscriptionDao.insert(request);

        if (subscription) {
            let response = {
                name: subscription.name,
                tag: subscription.tag,
                price: subscription.price,
                validity: subscription.validity,
                validityMeasure: subscription.validity_measure,
                gymId: subscription.fk_gym_id,
                is_active: subscription.is_active
            }
            return res.status(200).json(response);
        } else {
            return res.status(500).json(constants.error_messages[500]);
        }

    } catch (error) {
        return res.status(500).json(constants.error_messages[500]);
    }
}

let getSubscriptionByGymId = async (req, res) => {
    try {

        let gymId = req.params.gymId;
        let subscriptions = await subscriptionDao.getSubscriptionByGymId(gymId);

        if (subscriptions) {
            let response = [];
            subscriptions.forEach(subscription => {
                let obj = {
                    name: subscription.name,
                    price: `₹ ${parseFloat(subscription.price, 2).toFixed(2)}/-`,
                    validity: subscription.validity,
                    validityMeasure: subscription.validity_measure,
                    description: subscription.description,
                }
                response.push(obj);
            });
            return res.status(200).json(response);
        } else {
            return res.status(500).json(constants.error_messages[500]);
        }


    } catch (error) {
        return res.status(500).json(constants.error_messages[500]);
    }
}

let getUserActiveSubscription = async (req, res) => {
    try {
        let loggedInUser = req.loggedInUser;
        let activeSubscription = await activeSubscriptionsDao.getActiveSubscriptionsByUserId(loggedInUser.id);
        let subscription = await subscriptionDao.findById(activeSubscription[0].fk_subscription_id);

        if (activeSubscription && subscription) {
            let response = {
                name: subscription.name,
                validity: activeSubscription[0].valid_till,
                description: subscription.description,
                remainingAmount: activeSubscription[0].remaining_amount,
                creationDate: activeSubscription[0].createdAt,
            }
            return res.status(200).json(response);
        } else {
            return res.status(500).json(constants.error_messages[500]);
        }

    } catch (error) {
        return res.status(500).json(constants.error_messages[500]);
    }
}

module.exports = {
    addSubscription,
    getSubscriptionByGymId,
    getUserActiveSubscription
}