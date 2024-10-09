const express = require("express");
const constants = require("../config/constant")
const subscriptionDao = require("../dao/subscriptionPlans");
const activeSubscriptionsDao = require("../dao/activeSubscriptions");
const attendenceDao = require("../dao/attendence");
const gymDao = require("../dao/gymDetails");
const userDao = require("../dao/user");

let getLastAttendence = async (req, res) => {
    try {
        let loggedInUser = req.loggedInUser;

        if (loggedInUser) {
            let attendence = await attendenceDao.getLastAttendence(loggedInUser.id);
            if (!attendence) {
                return res.status(400).json("Data Not found");
            }

            attendence = attendence[0];

            if (attendence) {
                let response = {
                    total_cost: attendence.total_cost,
                    punch_in: attendence.createdAt
                }
                return res.status(200).json(response);
            } else {
                return res.status(400).json("No attendence found");
            }
        } else {
            return res.status(400).json("User not found");
        }

    } catch (error) {
        return res.status(500).json(constants.error_messages[500]);
    }
}

let getLastMonthPresentAndAbsentCount = async (req, res) => {
    try {
        let loggedInUser = req.loggedInUser;

        if (loggedInUser) {
            let attendence = await attendenceDao.getLastMonthDateById(loggedInUser.id);
            if (!attendence) {
                return res.status(400).json("Data Not found");
            }

            if (attendence) {
                let present = countUniqueValues(attendence, 'createdAt');
                let response = {
                    present: present,
                    absent: 30 - present,
                    last30Days: attendence
                }
                return res.status(200).json(response);
            } else {
                return res.status(400).json("No attendence found");
            }
        } else {
            return res.status(400).json("User not found");
        }

    } catch (error) {
        return res.status(500).json(constants.error_messages[500]);
    }
 }

 function countUniqueValues(arr, property) {
    const values = arr.map(item => item[property]);
    const uniqueValues = new Set(values);
    return uniqueValues.size;
  }

module.exports = {
    getLastAttendence,
    getLastMonthPresentAndAbsentCount
}