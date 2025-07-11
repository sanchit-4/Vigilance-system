const express = require("express");
const supabase = require("../config/supabase");
const router = express.Router();

// Get all guards
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("guards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Guards fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get guard by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("guards")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: "Guard not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Guard fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new guard
router.post("/", async (req, res) => {
  try {
    const guardData = req.body;

    const { data, error } = await supabase
      .from("guards")
      .insert([guardData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Guard creation error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update guard
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const guardData = req.body;

    const { data, error } = await supabase
      .from("guards")
      .update(guardData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Guard update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete guard
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("guards").delete().eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Guard deleted successfully" });
  } catch (error) {
    console.error("Guard deletion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get guard assignments
router.get("/:id/assignments", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("guard_assignments")
      .select(
        `
        *,
        locations (
          id,
          site_name,
          address,
          clients (name)
        )
      `
      )
      .eq("guard_id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Guard assignments fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
