import { useState, useEffect } from "react";
import api from "../api";
import AddNewCourse from "../pages/admin/AddNewCourse.jsx";
import {
    Card, CardContent, CardHeader, CardTitle
} from "./ProfileUI/card.jsx";
import { Button } from "./ProfileUI/button.jsx";
import { Badge } from "./ProfileUI/badge.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ProfileUI/avatar.jsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ProfileUI/dialog.jsx";
import { Input } from "./ProfileUI/input.jsx";
import { Label } from "./ProfileUI/label.jsx";
import {
    BookOpen, Users, FileText, Calendar, Edit,
    Mail, DollarSign, PlusCircle, BarChart3, Eye, Edit3
} from "lucide-react";

export function InstructorProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", bio: "", avatarUrl: "" });
    const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

    // --- Fetch profile info ---
    useEffect(() => {
        api.get("/auth/profile")
            .then(res => {
                const profile = res.data;
                setUserData({
                    ...profile,
                    currentCoursesList: [], // temporary until courses fetched
                    currentCoursesCreated: 0
                });
                setEditForm({
                    name: profile.name || "",
                    bio: profile.bio || "",
                    avatarUrl: profile.avatarUrl || ""
                });
            })
            .catch(err => console.error("Failed to fetch profile:", err));
    }, []);

    // --- Fetch instructor courses and students separately ---
    useEffect(() => {
        api.get("/enrollment/instructor/students")
            .then(res => {
                const courses = res.data;
                setUserData(prev => ({
                    ...prev,
                    currentCoursesList: courses,
                    currentCoursesCreated: courses.length
                }));
            })
            .catch(err => console.error("Failed to fetch instructor data:", err))
            .finally(() => setLoading(false));
    }, []);

    const openEditDialog = () => {
        if (!userData) return;
        setEditForm({
            name: userData.name || "",
            bio: userData.bio || "",
            avatarUrl: userData.avatarUrl || ""
        });
        setIsEditDialogOpen(true);
    };

    const handleSaveProfile = () => {
        if (!userData) return;

        // Prepare payload: only send fields that have values (we'll fix issue #2 here too)
        const payload = {
            name: editForm.name || userData.name,
            bio: editForm.bio || userData.bio,
            avatarUrl: editForm.avatarUrl || userData.avatarUrl,
        };

        api.put("/auth/profile", payload)
            .then((res) => {
                // Merge updated data with existing userData
                setUserData(prev => ({ ...prev, ...res.data }));
                setIsEditDialogOpen(false);
            })
            .catch((err) => console.error("Failed to update profile:", err));
    };

    const formatDate = (dateString) =>
        dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

    if (loading) return <div>Loading profile...</div>;
    if (!userData) return <div>Failed to load profile</div>;

    const totalStudents = userData.currentCoursesList.reduce(
      (sum, course) => sum + (course.studentsCount || 0), 0
    );

    return (
        <div className="space-y-8">

            {/* Profile Header */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 pb-5">
                <CardContent className="pt-8 px-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex-shrink-0">
                            <Avatar className="w-28 h-28 ring-4 ring-indigo-100 rounded-full">
                                <AvatarImage
                                    src={userData.avatarUrl || "/default-avatar.png"}
                                    alt={userData.name || "User"}
                                    className="object-cover w-full h-full"
                                />
                                <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-semibold">{userData.name || "N/A"}</h1>
                                    <h2 className="text-lg font-light text-gray-600 break-words">{userData.bio || "No Bio"}</h2>

                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            <span>{userData.email || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {formatDate(userData.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Profile Dialog */}
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={openEditDialog} variant="secondary" className="gap-2">
                                            <Edit className="w-4 h-4" /> Edit Profile
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Profile</DialogTitle>
                                            <DialogDescription>Update your name, bio, and avatar URL below.</DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    value={editForm.name}
                                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                    autoComplete="name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Input
                                                    id="bio"
                                                    value={editForm.bio}
                                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                                    autoComplete="bio"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="avatarUrl">Avatar URL</Label>
                                                <Input
                                                    id="avatarUrl"
                                                    value={editForm.avatarUrl}
                                                    onChange={e => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                                                    autoComplete="off"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-4">
                                                <Button onClick={handleSaveProfile} className="flex-1">Save Changes</Button>
                                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">Cancel</Button>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { icon: <BookOpen className="w-5 h-5 text-indigo-600" />, label: "Courses Created", value: userData.currentCoursesCreated || 0 },
                    { icon: <Users className="w-5 h-5 text-blue-600" />, label: "Students Learning", value: totalStudents },
                    { icon: <DollarSign className="w-5 h-5 text-green-600" />, label: "Total Revenue", value: userData.totalRevenue || 0 },
                    { icon: <FileText className="w-5 h-5 text-orange-600" />, label: "Quizzes Created", value: userData.quizzesCreated || 0 },
                ].map((stat, i) => (
                    <Card key={i} className="border-0 shadow-md rounded-xl hover:shadow-lg transition pb-3">
                        <CardContent className="pt-6 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">{stat.icon}</div>
                            <div>
                                <p className="text-2xl font-semibold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Current Courses */}
            <Card className="border-0 shadow-md rounded-xl pb-3">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-lg font-medium">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Current Courses ({userData.currentCoursesCreated || 0})
                        </CardTitle>
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => setIsAddCourseOpen(true)}
                        >
                            <PlusCircle className="w-4 h-4" /> Add Course
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {userData.currentCoursesList.length > 0 ? (
                            userData.currentCoursesList.map(course => (
                                <div key={course.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{course.title}</h4>
                                            <p className="text-sm text-muted-foreground">{course.studentsCount || 0} students enrolled</p>
                                        </div>
                                        <Badge variant={course.isPublished ? "default" : "secondary"} className="capitalize">
                                            {course.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center gap-4">
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Eye className="w-4 h-4" /> View
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <Edit3 className="w-4 h-4" /> Edit
                                        </Button>
                                        <Button size="sm" variant="outline" className="gap-1">
                                            <BarChart3 className="w-4 h-4" /> Analytics
                                        </Button>
                                    </div>

                                    <div className="mt-3">
                                        <h5 className="font-semibold text-sm mb-1">Enrolled Students</h5>
                                        {course.students && course.students.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {course.students.map(s => (
                                                    <li key={s.id}>{s.name} ({s.email})</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No students enrolled yet.</p>
                                        )}
                                    </div>

                                    <div className="mt-3">
                                        <h5 className="font-semibold text-sm mb-1">Quizzes</h5>
                                        {course.quizzes && course.quizzes.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-700">
                                                {course.quizzes.map(q => (
                                                    <li key={q.id}>
                                                        {q.title} – {q.submissions.length} submissions
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No quizzes yet.</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted-foreground italic">No courses found.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {isAddCourseOpen && (
                <AddNewCourse
                  onClose={() => setIsAddCourseOpen(false)}
                  onCourseAdded={(newCourse) => {
                    setUserData(prev => ({
                      ...prev,
                      currentCoursesList: [...prev.currentCoursesList, newCourse],
                      currentCoursesCreated: (prev.currentCoursesCreated || 0) + 1
                    }));
                  }}
                />
            )}

        </div>
    );
}