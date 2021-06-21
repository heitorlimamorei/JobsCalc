const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");
module.exports = {
  create(req, res) {
    return res.render("job");
  },
  async save(req, res) {
    await Job.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(), // atribuindo uma nova hora de hoje
    });

    return res.redirect("/"); // está retornadno um response que vai redirecionar o user para a '/' ou seja index
  },
  async show(req, res) {
    const profile = await Profile.get();
    const jobs =  await Job.get();
    const jobId = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(jobId));
    if (!job) {
      return res.send("Job not found!");
    }
    job.budget = JobUtils.calculateBudget(job, profile["value-hours"]);

    return res.render("job-edit", { job }); // verificar se é maisculo ou não
  },
  async update(req, res) {
    const jobId = req.params.id;
    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"]
    };
   
   await Job.update(updatedJob, jobId);

    res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;
   await Job.delete(jobId);
    return res.redirect("/");
  },
};
