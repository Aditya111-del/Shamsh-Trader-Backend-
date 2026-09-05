"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSponsor = exports.createSponsor = exports.getSponsors = void 0;
const Sponsor_1 = require("../models/Sponsor");
// @desc    Get all sponsors
// @route   GET /api/v1/sponsors
// @access  Public
const getSponsors = async (req, res, next) => {
    try {
        const sponsors = await Sponsor_1.Sponsor.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(sponsors);
    }
    catch (error) {
        next(error);
    }
};
exports.getSponsors = getSponsors;
// @desc    Create a new sponsor
// @route   POST /api/v1/sponsors
// @access  Private/Admin
const createSponsor = async (req, res, next) => {
    try {
        const { name, websiteUrl, tier } = req.body;
        if (!name || !websiteUrl) {
            res.status(400).json({ message: 'Name and website URL are required' });
            return;
        }
        const sponsor = await Sponsor_1.Sponsor.create({
            name,
            websiteUrl,
            tier: tier || 'Partner',
        });
        res.status(201).json(sponsor);
    }
    catch (error) {
        next(error);
    }
};
exports.createSponsor = createSponsor;
// @desc    Delete a sponsor
// @route   DELETE /api/v1/sponsors/:id
// @access  Private/Admin
const deleteSponsor = async (req, res, next) => {
    try {
        const sponsor = await Sponsor_1.Sponsor.findById(req.params.id);
        if (!sponsor) {
            res.status(404).json({ message: 'Sponsor not found' });
            return;
        }
        await sponsor.deleteOne();
        res.json({ message: 'Sponsor removed' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteSponsor = deleteSponsor;
