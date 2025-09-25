import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export const createCourse = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            fullDescription,
            category, 
            difficulty, 
            coverImageUrl, 
            estimatedDuration,
            prerequisites,
            learningOutcomes,
            language,
            modules, 
            isPublished 
        } = req.body;
        const instructorId = req.user.id;

        const course = await prisma.course.create({
            data: {
                title,
                slug: title.toLowerCase().replace(/\s+/g, "-"),
                description,
                fullDescription,
                category: category || "General",
                difficulty: difficulty || "BEGINNER",
                coverImageUrl,
                estimatedDuration,
                prerequisites,
                learningOutcomes,
                language: language || "English",
                isPublished: isPublished !== undefined ? isPublished : false, // Default to false (pending approval)
                instructorId,
                modules: modules
                    ? {
                        create: modules.map((m, index) => ({
                            title: m.title,
                            order: m.order ?? index + 1, // fallback if order is missing
                            lessons: m.lessons
                                ? {
                                    create: m.lessons.map((l, lIndex) => ({
                                        title: l.title,
                                        contentType: l.contentType || "ARTICLE",
                                        contentUrl: l.contentUrl || null,
                                        text: l.text || null,
                                        durationSec: l.durationSec || null,
                                        order: l.order ?? lIndex + 1,
                                    })),
                                }
                                : undefined,
                        })),
                    }
                    : undefined,
            },
            include: {
                modules: {
                    include: { lessons: true },
                },
            },
        });

        res.status(201).json(course);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: error.message || "Failed to create course" });
    }
};

export const createModule = async (req, res)=>{
    try{
        const {id} = req.params;
        const {title, order} = req.body;

        const module = await prisma.module.create({
            data: {
                title,
                order,
                courseId: Number(id),
            },
        });
        res.status(201).json(module);
    } catch (e) {
        console.log("Error creating module:", e);
        res.status(500).json({error: 'Failed to create module'});
    }
};

export const createLesson = async (req, res)=>{
    try{
        const {moduleId} = req.params;
        const {title, contentType, contentUrl, text, durationSec, order} = req.body;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                contentType,
                contentUrl,
                text,
                durationSec,
                order,
                moduleId: Number(moduleId),
            },
        })
        res.status(201).json(lesson);
    } catch (e) {
        console.log("Error creating lesson:", e);
        res.status(500).json({error: 'Failed to create lesson'});
    }
}


    export const getAllCourses = async (req, res)=> {
        try {
            // Check if this is an admin request
            const isAdmin = req.user?.role === 'ADMIN';
            const showAll = req.query.all === 'true' && isAdmin;
            
            const courses = await prisma.course.findMany({
                where: showAll ? {} : { isPublished: true }, // Only published courses for non-admin
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    },
                    modules: {
                        include: {
                            lessons: true,
                        },
                    }
                },
            });
            res.json(courses);
        } catch (err) {
            res.status(500).json({error: 'Failed to fetch courses'});
        }
    }

    export const getCourse = async (req, res)=>{
        try {
            const {id} = req.params;
            const course = await prisma.course.findUnique({
                where: {id: Number(id)},
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    },
                    modules: {
                        include: {
                            lessons: true,
                        },
                    },
                },
            });

            if (!course) {
                return res.status(404).json({error: 'Course not found'});
            }

            res.json(course);
        } catch (err) {
            res.status(500).json({error: 'Failed to fetch course'});
        }
    }

    export const updateCourse = async (req, res)=> {
        try {
            const {id} = req.params;
            const {
                title, 
                description, 
                fullDescription,
                category,
                difficulty, 
                estimatedDuration,
                prerequisites,
                learningOutcomes,
                language,
                coverImageUrl, 
                modules
            } = req.body;

            //update course level fields if provided
            let updatedCourse = null;
            const courseFieldUpdates = {};
            if (typeof title!== "undefined")
                courseFieldUpdates.title = title;
            if (typeof description!== "undefined")
                courseFieldUpdates.description = description;
            if (typeof fullDescription!== "undefined")
                courseFieldUpdates.fullDescription = fullDescription;
            if (typeof category!== "undefined")
                courseFieldUpdates.category = category;
            if (typeof difficulty !== "undefined")
                courseFieldUpdates.difficulty = difficulty;
            if (typeof estimatedDuration !== "undefined")
                courseFieldUpdates.estimatedDuration = estimatedDuration;
            if (typeof prerequisites !== "undefined")
                courseFieldUpdates.prerequisites = prerequisites;
            if (typeof learningOutcomes !== "undefined")
                courseFieldUpdates.learningOutcomes = learningOutcomes;
            if (typeof language !== "undefined")
                courseFieldUpdates.language = language;
            if (typeof coverImageUrl !== "undefined")
                courseFieldUpdates.coverImageUrl = coverImageUrl;
            if (Object.keys(courseFieldUpdates).length > 0) {
                updatedCourse = await prisma.course.update({
                    where: {id: Number(id)},
                    data: courseFieldUpdates,
                });
            }
            // handle module and lesson updates
            if(Array.isArray(modules)){
                for (const m of modules){
                    let moduleId = m.id? Number(m.id): null;
                    if (moduleId) {
                        // update existing module
                        const moduleUpdateData = {}
                        if (typeof m.title !== "undefined")
                            moduleUpdateData.title = m.title;
                        if (typeof m.order != "undefined")
                            moduleUpdateData.order = m.order;
                        await prisma.module.update({
                            where: {id: moduleId},
                            data: moduleUpdateData,
                        });
                    }
                    // Handle lessons
                    if (Array.isArray(m.lessons)){
                        for (const l of m.lessons){
                            let lessonId = l.id ? Number(l.id) : null;
                            if (lessonId){
                                //update existing lesson
                                const lessonUpdateData = {};
                                if (typeof l.title !== "undefined")
                                    lessonUpdateData.title = l.title;
                                if (typeof l.contentType !== "undefined")
                                    lessonUpdateData.contentType = l.contentType;
                                if (typeof l.contentUrl !== "undefined")
                                    lessonUpdateData.contentUrl = l.contentUrl;
                                if (typeof l.text !== "undefined")
                                    lessonUpdateData.text = l.text;
                                if (typeof l.durationSec !== "undefined")
                                    lessonUpdateData.durationSec = l.durationSec;
                                if (typeof l.order !== "undefined")
                                    lessonUpdateData.order = l.order;
                                await prisma.lesson.update({
                                    where: {id: lessonId},
                                    data: lessonUpdateData,
                                });
                            }
                        }
                    }

                }
            }
            // always return course details
            const courseWithDetails = await prisma.course.findUnique({
                where:{id: Number(id)},
                include:{
                    instructor:{
                        select:{
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    },
                    modules:{
                        include:{
                            lessons: true,
                        },
                    },
                }
            });
            res.json(courseWithDetails);

        } catch (err) {
            res.status(500).json({error:"Failed to update course"})
        }
    }

export const deleteCourse= async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id: Number(id) },
            include: {
                modules: { include: { lessons: true } },
            },
        });

        if (!course) return res.status(404).json({ error: "Course not found" });

        // Delete all lessons
        for (const module of course.modules) {
            await prisma.lesson.deleteMany({ where: { moduleId: module.id } });
        }

        // Delete all modules
        await prisma.module.deleteMany({ where: { courseId: course.id } });

        // Delete the course
        await prisma.course.delete({ where: { id: course.id } });

        res.json({ message: "Course, modules, and lessons deleted successfully" });
    } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).json({ error: "Failed to delete course and related data" });
    }
};
    export const togglePublishCourse = async (req, res) =>{
        try {
            const {id} = req.params;
            const course = await prisma.course.findUnique({
                where: {id: Number(id)},
            });

            if (!course) {
                return res.status(404).json({error: 'Course not found'});
            }

            const updatedCourse = await prisma.course.update({
                where: {id: Number(id)},
                data: {isPublished: !course.isPublished},
            });

            res.json(updatedCourse);
        } catch (err) {
            res.status(500).json({error: 'Failed to toggle course publication status'});
        }
    }

    // Get pending courses for admin approval
    export const getPendingCourses = async (req, res) => {
        try {
            const pendingCourses = await prisma.course.findMany({
                where: { isPublished: false },
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    },
                    modules: {
                        include: {
                            lessons: true,
                        },
                    }
                },
            });
            res.json(pendingCourses);
        } catch (err) {
            res.status(500).json({error: 'Failed to fetch pending courses'});
        }
    }

    // Approve a course
    export const approveCourse = async (req, res) => {
        try {
            const {id} = req.params;
            const updatedCourse = await prisma.course.update({
                where: {id: Number(id)},
                data: {isPublished: true},
                include: {
                    instructor: {
                        select: {
                            id: true,
                            name: true,
                            avatarUrl: true,
                        },
                    }
                }
            });

            res.json({message: 'Course approved successfully', course: updatedCourse});
        } catch (err) {
            res.status(500).json({error: 'Failed to approve course'});
        }
    }

    // Reject a course
    export const rejectCourse = async (req, res) => {
        try {
            const {id} = req.params;
            // For now, we'll just delete rejected courses
            // In a real app, you might want to keep them with a 'rejected' status
            await prisma.course.delete({
                where: {id: Number(id)}
            });

            res.json({message: 'Course rejected and removed successfully'});
        } catch (err) {
            res.status(500).json({error: 'Failed to reject course'});
        }
    }