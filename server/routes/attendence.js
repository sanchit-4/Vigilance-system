const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

// Get attendance records
router.get("/", async (req, res) => {
  try {
    const { guard_id, location_id, status, date_from, date_to } = req.query;

    let query = supabase
      .from("attendance")
      .select(
        `
        *,
        guards (name, category),
        locations (site_name, address, clients (name))
      `
      )
      .order("check_in_time", { ascending: false });

    // Apply filters
    if (guard_id) query = query.eq("guard_id", guard_id);
    if (location_id) query = query.eq("location_id", location_id);
    if (status) query = query.eq("status", status);
    if (date_from) query = query.gte("check_in_time", date_from);
    if (date_to) query = query.lte("check_in_time", date_to);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Attendance fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create attendance record
router.post("/", async (req, res) => {
  try {
    const attendanceData = req.body;

    const { data, error } = await supabase
      .from("attendance")
      .insert([attendanceData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Attendance creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update attendance record (for approval/rejection)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, confirmed_by_supervisor_id } = req.body;

    const updateData = {
      status,
      confirmed_by_supervisor_id,
      confirmation_timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("attendance")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Attendance update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get attendance statistics
router.get("/stats", async (req, res) => {
  try {
    const { guard_id, location_id, date_from, date_to } = req.query;

    let query = supabase.from("attendance").select("status");

    // Apply filters
    if (guard_id) query = query.eq("guard_id", guard_id);
    if (location_id) query = query.eq("location_id", location_id);
    if (date_from) query = query.gte("check_in_time", date_from);
    if (date_to) query = query.lte("check_in_time", date_to);

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Calculate statistics
    const stats = {
      total: data.length,
      approved: data.filter((a) => a.status === "Approved").length,
      pending: data.filter((a) => a.status === "Pending Approval").length,
      rejected: data.filter((a) => a.status === "Rejected").length,
    };

    res.json(stats);
  } catch (error) {
    console.error("Attendance stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
