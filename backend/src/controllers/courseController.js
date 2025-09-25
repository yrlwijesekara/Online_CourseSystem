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
            console.log('=== COURSE UPDATE REQUEST ===');
            console.log('Course ID:', req.params.id);
            console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
            console.log('Request body:', JSON.stringify(req.body, null, 2));

            const {id} = req.params;
            
            // Validate course ID
            if (!id || isNaN(Number(id))) {
                console.error('Invalid course ID:', id);
                return res.status(400).json({ error: 'Invalid course ID provided' });
            }

            // Check if course exists first
            const existingCourse = await prisma.course.findUnique({
                where: { id: Number(id) },
                include: { instructor: true }
            });

            if (!existingCourse) {
                console.error('Course not found with ID:', id);
                return res.status(404).json({ error: 'Course not found' });
            }

            console.log('Existing course found:', {
                id: existingCourse.id,
                title: existingCourse.title,
                instructorId: existingCourse.instructorId
            });

            // Check permissions - user must be the instructor or admin
            if (req.user.role !== 'ADMIN' && req.user.id !== existingCourse.instructorId) {
                console.error('Permission denied. User:', req.user.id, 'Course instructor:', existingCourse.instructorId);
                return res.status(403).json({ error: 'Permission denied. You can only edit your own courses.' });
            }

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

            // Validate required fields if provided
            const validationErrors = [];
            
            if (title !== undefined && (!title || title.trim().length === 0)) {
                validationErrors.push('Title cannot be empty');
            }
            if (description !== undefined && (!description || description.trim().length === 0)) {
                validationErrors.push('Description cannot be empty');
            }
            if (difficulty !== undefined && !['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].includes(difficulty)) {
                validationErrors.push('Difficulty must be BEGINNER, INTERMEDIATE, or ADVANCED');
            }

            if (validationErrors.length > 0) {
                console.error('Validation errors:', validationErrors);
                return res.status(400).json({ error: validationErrors.join(', ') });
            }

            console.log('Validation passed, proceeding with update...');

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
                console.log('=== UPDATING COURSE FIELDS ===');
                console.log('Fields to update:', JSON.stringify(courseFieldUpdates, null, 2));
                try {
                    updatedCourse = await prisma.course.update({
                        where: {id: Number(id)},
                        data: courseFieldUpdates,
                    });
                    console.log('✅ SUCCESS: Course fields updated successfully');
                    console.log('Updated course ID:', updatedCourse.id);
                } catch (updateError) {
                    console.log('❌ ERROR: Failed to update course fields');
                    console.error('Update error details:', updateError);
                    console.error('Error code:', updateError.code);
                    console.error('Error message:', updateError.message);
                    return res.status(500).json({ 
                        error: 'Failed to update course fields', 
                        details: updateError.message 
                    });
                }
            } else {
                console.log('No course fields to update');
            }
            // handle module and lesson updates
            if(Array.isArray(modules)){
                console.log('Processing module updates for', modules.length, 'modules');
                for (const m of modules){
                    let moduleId = m.id? Number(m.id): null;
                    if (moduleId) {
                        console.log('Updating module:', moduleId, 'with data:', m);
                        // update existing module
                        const moduleUpdateData = {}
                        if (typeof m.title !== "undefined")
                            moduleUpdateData.title = m.title;
                        if (typeof m.order != "undefined")
                            moduleUpdateData.order = m.order;
                        
                        try {
                            await prisma.module.update({
                                where: {id: moduleId},
                                data: moduleUpdateData,
                            });
                            console.log('✅ SUCCESS: Module updated successfully, ID:', moduleId);
                        } catch (moduleError) {
                            console.log('❌ ERROR: Failed to update module', moduleId);
                            console.error('Module update error details:', moduleError);
                            console.error('Module error code:', moduleError.code);
                            console.error('Module error message:', moduleError.message);
                            return res.status(500).json({ 
                                error: `Failed to update module ${moduleId}`, 
                                details: moduleError.message 
                            });
                        }
                    }
                    // Handle lessons
                    if (Array.isArray(m.lessons)){
                        console.log('Processing lessons for module:', moduleId);
                        for (const l of m.lessons){
                            let lessonId = l.id ? Number(l.id) : null;
                            if (lessonId){
                                console.log('Updating lesson:', lessonId, 'with data:', l);
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
                                    
                                try {
                                    await prisma.lesson.update({
                                        where: {id: lessonId},
                                        data: lessonUpdateData,
                                    });
                                    console.log('✅ SUCCESS: Lesson updated successfully, ID:', lessonId);
                                } catch (lessonError) {
                                    console.log('❌ ERROR: Failed to update lesson', lessonId);
                                    console.error('Lesson update error details:', lessonError);
                                    console.error('Lesson error code:', lessonError.code);
                                    console.error('Lesson error message:', lessonError.message);
                                    return res.status(500).json({ 
                                        error: `Failed to update lesson ${lessonId}`, 
                                        details: lessonError.message 
                                    });
                                }
                            } else {
                                // Create new lesson
                                console.log('Creating new lesson for module:', moduleId);
                                try {
                                    const newLesson = await prisma.lesson.create({
                                        data: {
                                            title: l.title || 'Untitled Lesson',
                                            contentType: l.contentType || 'TEXT',
                                            contentUrl: l.contentUrl || '',
                                            text: l.text || '',
                                            durationSec: l.durationSec || 0,
                                            order: l.order || 0,
                                            moduleId: moduleId,
                                        },
                                    });
                                    console.log('✅ SUCCESS: New lesson created successfully, ID:', newLesson.id, 'for module:', moduleId);
                                } catch (createError) {
                                    console.log('❌ ERROR: Failed to create lesson for module', moduleId);
                                    console.error('Lesson creation error details:', createError);
                                    console.error('Lesson creation error code:', createError.code);
                                    console.error('Lesson creation error message:', createError.message);
                                    return res.status(500).json({ 
                                        error: `Failed to create lesson for module ${moduleId}`, 
                                        details: createError.message 
                                    });
                                }
                            }
                        }
                    }

                    // Handle new module creation (if moduleId is null)
                    if (!moduleId) {
                        console.log('Creating new module for course:', id);
                        try {
                            const newModule = await prisma.module.create({
                                data: {
                                    title: m.title || 'Untitled Module',
                                    order: m.order || 0,
                                    courseId: Number(id),
                                },
                            });
                            console.log('New module created successfully:', newModule.id);
                            
                            // Handle lessons for the new module
                            if (Array.isArray(m.lessons) && m.lessons.length > 0) {
                                console.log('Creating lessons for new module:', newModule.id);
                                for (const l of m.lessons) {
                                    try {
                                        await prisma.lesson.create({
                                            data: {
                                                title: l.title || 'Untitled Lesson',
                                                contentType: l.contentType || 'TEXT',
                                                contentUrl: l.contentUrl || '',
                                                text: l.text || '',
                                                durationSec: l.durationSec || 0,
                                                order: l.order || 0,
                                                moduleId: newModule.id,
                                            },
                                        });
                                        console.log('Lesson created for new module:', newModule.id);
                                    } catch (lessonCreateError) {
                                        console.error('Error creating lesson for new module:', newModule.id, lessonCreateError);
                                        return res.status(500).json({ 
                                            error: `Failed to create lesson for new module ${newModule.id}`, 
                                            details: lessonCreateError.message 
                                        });
                                    }
                                }
                            }
                        } catch (moduleCreateError) {
                            console.error('Error creating new module:', moduleCreateError);
                            return res.status(500).json({ 
                                error: 'Failed to create new module', 
                                details: moduleCreateError.message 
                            });
                        }
                    }

                }
            }
            
            console.log('=== FETCHING UPDATED COURSE DETAILS ===');
            // always return course details
            try {
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

                if (!courseWithDetails) {
                    console.log('❌ ERROR: Course not found after update');
                    return res.status(404).json({ error: 'Course not found after update' });
                }

                console.log('✅ SUCCESS: Course update completed successfully');
                console.log('Final course details:', {
                    id: courseWithDetails.id,
                    title: courseWithDetails.title,
                    modulesCount: courseWithDetails.modules.length,
                    updatedAt: courseWithDetails.updatedAt
                });

                res.json(courseWithDetails);
            } catch (fetchError) {
                console.log('❌ ERROR: Failed to fetch updated course details');
                console.error('Fetch error details:', fetchError);
                console.error('Fetch error code:', fetchError.code);
                console.error('Fetch error message:', fetchError.message);
                return res.status(500).json({ 
                    error: 'Course updated but failed to fetch details', 
                    details: fetchError.message 
                });
            }

        } catch (err) {
            console.error('=== COURSE UPDATE ERROR ===');
            console.error('Error details:', err);
            console.error('Stack trace:', err.stack);
            
            // More specific error messages
            if (err.code === 'P2002') {
                return res.status(400).json({ error: 'A course with this title already exists' });
            } else if (err.code === 'P2025') {
                return res.status(404).json({ error: 'Course not found or already deleted' });
            } else if (err.code === 'P2003') {
                return res.status(400).json({ error: 'Invalid reference to related data' });
            }
            
            res.status(500).json({
                error: "Failed to update course",
                details: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
            });
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