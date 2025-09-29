import { useState, useEffect } from "react";
import api from "../api"; // adjust path if needed
import {
    Card, CardContent, CardHeader, CardTitle
} from "./ProfileUI/card.jsx";
import { Button } from "./ProfileUI/button.jsx";
import { Badge } from "./ProfileUI/badge.jsx";
import { Progress } from "./ProfileUI/progress.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "./ProfileUI/avatar.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "./ProfileUI/dialog.jsx";
import { Input } from "./ProfileUI/input.jsx";
import { Label } from "./ProfileUI/label.jsx";
import { BookOpen, Award, CheckCircle, FileText, Edit, Mail, Calendar, TrendingUp, Clock } from "lucide-react";

export function StudentProfile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({ name: "", bio: "", avatarUrl: "" });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/auth/profile");
                const data = res.data;

                // Map enrollments to course objects with progress
                const courses = data.enrollments?.map(e => ({
                    id: e.course.id,
                    title: e.course.title,
                    coverImageUrl: e.course.coverImageUrl,
                    progress: e.progress || 0,
                    slug: e.course.slug,
                })) || [];

                const enrolledCourses = courses.length;
                const completedCourses = courses.filter(c => c.progress === 100).length;
                const certificates = data.certificates?.length || 0;
                const quizzesCompleted = data.QuizSubmission?.length || 0;
                const totalQuizzes = data.totalQuizzes || 0;

                setUserData({
                    ...data,
                    courses,
                    enrolledCourses,
                    completedCourses,
                    certificates,
                    quizzesCompleted,
                    totalQuizzes,
                    progress: data.progress || 0, // optional overall progress
                });

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
        dateString ? new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric"
        }) : "N/A";


    if (loading) return <div>Loading profile...</div>;
    if (!userData) return <div>Failed to load profile</div>;

    return (
        <div className="space-y-8">

            {/* Profile Header */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 overflow-hidden rounded-xl">
                <CardContent className="pt-6 px-6 pb-3">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-6 -mt-2">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <Avatar className="w-24 h-24 ring-2 ring-indigo-100 rounded-full overflow-hidden bg-white">
                                <AvatarImage
                                    src={userData.avatarUrl || "/default-avatar.png"}
                                    alt={userData.name || "User"}
                                    className="object-cover w-full h-full"
                                />
                                <AvatarFallback>{userData.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Info + Edit Button */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                <div className="min-w-0">
                                    <h1 className="text-3xl font-semibold truncate">{userData.name || "N/A"}</h1>
                                    <h2 className="text-lg font-light text-gray-600 break-words">{userData.bio || "N/A"}</h2>
                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-2 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{userData.email || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Joined {formatDate(userData.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 self-start">
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="gap-2">
                                                <Edit className="w-4 h-4" /> Edit Profile
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Profile</DialogTitle>
                                                <DialogDescription>Update your name, email, and avatar URL below.</DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        autoComplete="name"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Input
                                                        id="bio"
                                                        type="text"
                                                        value={editForm.bio}
                                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                                        autoComplete="bio"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                                                    <Input
                                                        id="avatarUrl"
                                                        value={editForm.avatarUrl}
                                                        onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
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
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
                {[
                    { icon: <BookOpen className="w-5 h-5 text-indigo-600" />, label: "Enrolled Courses", value: userData.enrolledCourses },
                    { icon: <CheckCircle className="w-5 h-5 text-green-600" />, label: "Completed", value: userData.completedCourses },
                    { icon: <Award className="w-5 h-5 text-blue-600" />, label: "Certificates", value: userData.certificates },
                    { icon: <FileText className="w-5 h-5 text-orange-600" />, label: "Quizzes", value: `${userData.quizzesCompleted}/${userData.totalQuizzes}` },
                ].map((stat, i) => (
                    <Card key={i} className="border-0 shadow-md rounded-xl hover:shadow-lg transition pb-4">
                        <CardContent className="pt-6 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">{stat.icon}</div>
                            <div className="min-w-0">
                                <p className="text-2xl font-semibold">{stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Overall Progress */}
            <Card className="border-0 shadow-md rounded-xl pt-0.5 pb-0.5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <TrendingUp className="w-5 h-5 text-indigo-600" /> Overall Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span>Learning Progress</span>
                            <span className="font-semibold">{userData.progress || 0}%</span>
                        </div>
                        <Progress value={userData.progress || 0} className="h-3" />
                    </div>
                </CardContent>
            </Card>

            {/* Current Courses */}
            <Card className="border-0 shadow-md rounded-xl pb-3">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-medium">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        Current Courses ({userData.courses.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {userData.courses.length > 0 ? (
                        userData.courses.map(course => (
                            <div key={course.id} className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div className="min-w-0">
                                        <h4 className="font-medium truncate">{course.title || "Untitled Course"}</h4>
                                    </div>
                                    <Badge variant="secondary">{course.progress || 0}%</Badge>
                                </div>
                                <Progress value={course.progress || 0} className="h-2" />
                                <Button size="sm" className="w-full">Continue Learning</Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground italic">No courses found.</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}