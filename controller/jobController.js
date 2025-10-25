// add job

const jobs = require("../model/jobModel")

exports.addJobController = async (req, res) => {
    const { jobTitle, jobLocation, jobType, salary, qualification, experience, description } = req.body
    console.log(jobTitle, jobLocation, jobType, salary, qualification, experience, description);

    try {
        const existingJob = await jobs.findOne({ jobTitle, jobLocation })
        if (existingJob) {
            res.status(401).json(`Job Already Added`)
        } else {
            const newJob = new jobs({
                jobTitle, jobLocation, jobType, salary, qualification, experience, description
            })
            await newJob.save()
            res.status(200).json(newJob)
        }
    } catch (error) {
        res.status(500).json(error)
    }

}

// get all job details
exports.getAllJobsController = async (req, res)=>{
    const {search} = req.query
    console.log(search);
    
    try {
        const allJobs = await jobs.find({
            jobTitle:{
                $regex:search, $options:"i"
            }
        })
        res.status(200).json(allJobs)
    } catch (error) {
        res.status(500).json(error)
    }
}

// delete job controller
exports.deleteJobController = async (req, res)=>{
    const {id} = req.params
    console.log(id);
    
   try {
        await jobs.findByIdAndDelete({_id : id})
        res.status(200).json("Job Deleted Successfully")
    } catch (error) {
        res.status(500).json(error)
    }
}