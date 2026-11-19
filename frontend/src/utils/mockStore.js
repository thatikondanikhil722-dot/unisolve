// Embedded Local Store for Standalone / Offline Mobile App Operation
// Ensures 100% of features work smoothly inside the APK even without a local PC server running.

const SEED_USERS = [
  {
    id: 'STU-2024-001',
    name: 'Rahul Kumar',
    username: 'student1',
    password: 'student123',
    email: 'rahul.kumar@university.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    year: 'Year 3',
    created_at: new Date(Date.now() - 5000 * 60000).toISOString()
  },
  {
    id: 'STU-2024-002',
    name: 'Priya Sharma',
    username: 'student2',
    password: 'student123',
    email: 'priya.sharma@university.edu',
    role: 'student',
    department: 'Electrical Engineering',
    year: 'Year 2',
    created_at: new Date(Date.now() - 5000 * 60000).toISOString()
  },
  {
    id: 'STU-2024-003',
    name: 'Arjun Reddy',
    username: 'student3',
    password: 'student123',
    email: 'arjun.reddy@university.edu',
    role: 'student',
    department: 'Mechanical Engineering',
    year: 'Year 4',
    created_at: new Date(Date.now() - 5000 * 60000).toISOString()
  },
  {
    id: 'ADM-2024-001',
    name: 'Dr. Sarah Jenkins',
    username: 'admin',
    password: 'admin123',
    email: 'admin@university.edu',
    role: 'admin',
    department: 'Dean of Student Affairs',
    year: null,
    created_at: new Date(Date.now() - 5000 * 60000).toISOString()
  }
];

const SEED_ISSUES = [
  {
    id: 'ISS-2026-001',
    student_id: 'STU-2024-001',
    student_name: 'Rahul Kumar',
    title: 'Wi-Fi connectivity failure in Hostel Block B',
    description: 'The wireless access points on the 2nd and 3rd floors of Hostel Block B have been flashing red and disconnecting every 2 minutes since yesterday evening. Students cannot submit online lab assignments or access the university intranet portal.',
    category: 'Internet / Wi-Fi',
    priority: 'High',
    status: 'Under Review',
    created_at: new Date(Date.now() - 180 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'ISS-2026-002',
    student_id: 'STU-2024-002',
    student_name: 'Priya Sharma',
    title: 'Ceiling projector not displaying in Classroom 204',
    description: 'The HDMI input cable for the ceiling-mounted projector in Classroom 204 is damaged, producing distorted purple lines on the screen during morning lectures.',
    category: 'Classroom',
    priority: 'Medium',
    status: 'Pending',
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 120 * 60000).toISOString()
  },
  {
    id: 'ISS-2026-003',
    student_id: 'STU-2024-001',
    student_name: 'Rahul Kumar',
    title: 'Examination schedule clash between CS301 and MA302',
    description: 'Both CS301 (Advanced Algorithms) and MA302 (Discrete Mathematics) end-semester examinations are currently scheduled on Monday at 09:30 AM in Hall C. Kindly review the timetable conflict.',
    category: 'Examination',
    priority: 'High',
    status: 'Resolved',
    created_at: new Date(Date.now() - 1440 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 720 * 60000).toISOString()
  },
  {
    id: 'ISS-2026-004',
    student_id: 'STU-2024-003',
    student_name: 'Arjun Reddy',
    title: 'Hostel Block C 4th Floor water supply pressure issue',
    description: 'There has been low water pressure in the morning between 6 AM and 8 AM on the 4th floor of Hostel Block C. Hot water geysers cannot trip on due to low inlet pressure.',
    category: 'Hostel',
    priority: 'High',
    status: 'Resolved',
    created_at: new Date(Date.now() - 2880 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 1200 * 60000).toISOString()
  },
  {
    id: 'ISS-2026-005',
    student_id: 'STU-2024-001',
    student_name: 'Rahul Kumar',
    title: 'Request for extended central library opening hours during midterms',
    description: 'During the upcoming midterm exam week, students would appreciate if the Central Library reading halls could remain open until 2:00 AM instead of closing at 10:00 PM.',
    category: 'Library',
    priority: 'Low',
    status: 'Pending',
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 60000).toISOString()
  }
];

const SEED_REPLIES = [
  {
    id: 'REP-001',
    issue_id: 'ISS-2026-001',
    sender_id: 'ADM-2024-001',
    sender_name: 'Dr. Sarah Jenkins',
    sender_role: 'admin',
    message: 'Your issue has been acknowledged and forwarded to the campus IT Network Operations team. An engineer (Mr. Sharma) has been dispatched with replacement POE switches.',
    created_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'REP-002',
    issue_id: 'ISS-2026-001',
    sender_id: 'STU-2024-001',
    sender_name: 'Rahul Kumar',
    sender_role: 'student',
    message: 'Thank you Dr. Jenkins. The engineer just arrived at Block B and is currently testing the switch rack.',
    created_at: new Date(Date.now() - 45 * 60000).toISOString()
  },
  {
    id: 'REP-003',
    issue_id: 'ISS-2026-003',
    sender_id: 'ADM-2024-001',
    sender_name: 'Dr. Sarah Jenkins',
    sender_role: 'admin',
    message: 'The examination committee met today and resolved the clash. MA302 has been rescheduled to Tuesday 02:00 PM in Hall A. The revised timetable has been published on the notice board.',
    created_at: new Date(Date.now() - 720 * 60000).toISOString()
  },
  {
    id: 'REP-004',
    issue_id: 'ISS-2026-004',
    sender_id: 'ADM-2024-001',
    sender_name: 'Dr. Sarah Jenkins',
    sender_role: 'admin',
    message: 'The campus estate maintenance crew replaced the secondary booster pressure pump this morning. Water pressure is restored to 3.2 bar.',
    created_at: new Date(Date.now() - 1200 * 60000).toISOString()
  }
];

const SEED_FEEDBACK = [
  {
    id: 'FB-001',
    issue_id: 'ISS-2026-003',
    student_id: 'STU-2024-001',
    rating: 5,
    comment: 'Timetable conflict resolved remarkably fast before the revision week started. Thank you so much!',
    created_at: new Date(Date.now() - 700 * 60000).toISOString()
  },
  {
    id: 'FB-002',
    issue_id: 'ISS-2026-004',
    student_id: 'STU-2024-003',
    rating: 4,
    comment: 'Water pressure is back to normal now. Good quick response from the maintenance department.',
    created_at: new Date(Date.now() - 1100 * 60000).toISOString()
  }
];

const SEED_NOTIFS = [
  {
    id: 'NOTIF-001',
    user_id: 'STU-2024-001',
    issue_id: 'ISS-2026-001',
    message: 'Admin Dr. Sarah Jenkins replied to your issue ISS-2026-001 ("Wi-Fi connectivity failure in Hostel Block B")',
    is_read: 0,
    created_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'NOTIF-002',
    user_id: 'STU-2024-001',
    issue_id: 'ISS-2026-001',
    message: 'The status of your issue ISS-2026-001 changed to "Under Review"',
    is_read: 1,
    created_at: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'NOTIF-003',
    user_id: 'STU-2024-001',
    issue_id: 'ISS-2026-003',
    message: 'Your issue ISS-2026-003 has been marked as Resolved. Please provide your feedback.',
    is_read: 1,
    created_at: new Date(Date.now() - 720 * 60000).toISOString()
  },
  {
    id: 'NOTIF-004',
    user_id: 'ADM-2024-001',
    issue_id: 'ISS-2026-005',
    message: 'New issue submitted by Rahul Kumar: "Request for extended central library opening hours during midterms"',
    is_read: 0,
    created_at: new Date(Date.now() - 60 * 60000).toISOString()
  },
  {
    id: 'NOTIF-005',
    user_id: 'ADM-2024-001',
    issue_id: 'ISS-2026-002',
    message: 'New issue submitted by Priya Sharma: "Ceiling projector not displaying in Classroom 204"',
    is_read: 0,
    created_at: new Date(Date.now() - 120 * 60000).toISOString()
  }
];

class MockStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem('uni_mock_initialized')) {
      localStorage.setItem('uni_mock_users', JSON.stringify(SEED_USERS));
      localStorage.setItem('uni_mock_issues', JSON.stringify(SEED_ISSUES));
      localStorage.setItem('uni_mock_replies', JSON.stringify(SEED_REPLIES));
      localStorage.setItem('uni_mock_feedback', JSON.stringify(SEED_FEEDBACK));
      localStorage.setItem('uni_mock_notifs', JSON.stringify(SEED_NOTIFS));
      localStorage.setItem('uni_mock_initialized', 'true');
    }
  }

  getUsers() { return JSON.parse(localStorage.getItem('uni_mock_users') || '[]'); }
  getIssues() { return JSON.parse(localStorage.getItem('uni_mock_issues') || '[]'); }
  getReplies() { return JSON.parse(localStorage.getItem('uni_mock_replies') || '[]'); }
  getFeedback() { return JSON.parse(localStorage.getItem('uni_mock_feedback') || '[]'); }
  getNotifs() { return JSON.parse(localStorage.getItem('uni_mock_notifs') || '[]'); }

  setIssues(val) { localStorage.setItem('uni_mock_issues', JSON.stringify(val)); }
  setReplies(val) { localStorage.setItem('uni_mock_replies', JSON.stringify(val)); }
  setFeedback(val) { localStorage.setItem('uni_mock_feedback', JSON.stringify(val)); }
  setNotifs(val) { localStorage.setItem('uni_mock_notifs', JSON.stringify(val)); }

  login(username, password) {
    const clean = (username || '').trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(u => 
      u.username.toLowerCase() === clean || 
      u.id.toLowerCase() === clean ||
      (clean === 'admin' && u.role === 'admin') ||
      (clean === 'student' && u.role === 'student')
    );
    if (!user) {
      throw new Error('User not found. Use student1 or admin.');
    }
    const cleanPass = (password || '').trim();
    if (user.password !== cleanPass && cleanPass !== 'student123' && cleanPass !== 'admin123') {
      throw new Error('Invalid password. Try student123 or admin123');
    }
    const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
    return { token, user };
  }

  getStats(currentUser) {
    const issues = this.getIssues();
    if (currentUser.role === 'student') {
      const myIssues = issues.filter(i => i.student_id === currentUser.id);
      return {
        total: myIssues.length,
        pending: myIssues.filter(i => i.status === 'Pending').length,
        underReview: myIssues.filter(i => i.status === 'Under Review').length,
        resolved: myIssues.filter(i => i.status === 'Resolved').length,
        rejected: myIssues.filter(i => i.status === 'Rejected').length,
        recentIssues: myIssues.slice(0, 5)
      };
    } else {
      const allFeedback = this.getFeedback();
      const avg = allFeedback.length > 0 
        ? (allFeedback.reduce((a, b) => a + b.rating, 0) / allFeedback.length).toFixed(1)
        : 5.0;

      const catMap = {};
      issues.forEach(i => { catMap[i.category] = (catMap[i.category] || 0) + 1; });
      const categoryBreakdown = Object.entries(catMap).map(([category, count]) => ({ category, count }));

      return {
        total: issues.length,
        pending: issues.filter(i => i.status === 'Pending').length,
        underReview: issues.filter(i => i.status === 'Under Review').length,
        resolved: issues.filter(i => i.status === 'Resolved').length,
        rejected: issues.filter(i => i.status === 'Rejected').length,
        highPriority: issues.filter(i => i.priority === 'High' && i.status !== 'Resolved' && i.status !== 'Rejected').length,
        categoryBreakdown,
        feedbackSummary: {
          average: Number(avg),
          totalReviews: allFeedback.length
        },
        recentIssues: issues.slice(0, 6)
      };
    }
  }

  getIssueList(currentUser, searchParams) {
    let list = this.getIssues();
    if (currentUser.role === 'student') {
      list = list.filter(i => i.student_id === currentUser.id);
    }
    const status = searchParams.get('status');
    if (status && status !== 'All') list = list.filter(i => i.status === status);
    const category = searchParams.get('category');
    if (category && category !== 'All') list = list.filter(i => i.category === category);
    const priority = searchParams.get('priority');
    if (priority && priority !== 'All') list = list.filter(i => i.priority === priority);
    const search = searchParams.get('search');
    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i => 
        i.id.toLowerCase().includes(q) ||
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        (i.student_name && i.student_name.toLowerCase().includes(q))
      );
    }
    return { issues: list };
  }

  getIssueDetails(id) {
    const issues = this.getIssues();
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    const replies = this.getReplies().filter(r => r.issue_id === id);
    const feedback = this.getFeedback().find(f => f.issue_id === id) || null;
    const users = this.getUsers();
    const student = users.find(u => u.id === issue.student_id) || {
      id: issue.student_id,
      name: issue.student_name,
      department: 'Computer Science',
      year: 'Year 3',
      email: 'student@university.edu'
    };
    return { issue, student, replies, feedback };
  }

  createIssue(currentUser, { title, description, category, priority }) {
    const issues = this.getIssues();
    const id = `ISS-2026-${String(issues.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newIssue = {
      id,
      student_id: currentUser.id,
      student_name: currentUser.name,
      title,
      description,
      category,
      priority,
      status: 'Pending',
      created_at: now,
      updated_at: now
    };
    issues.unshift(newIssue);
    this.setIssues(issues);

    const notifs = this.getNotifs();
    notifs.unshift({
      id: `NOTIF-${Date.now()}`,
      user_id: currentUser.id,
      issue_id: id,
      message: `Your issue ${id} ("${title}") was successfully submitted and is Pending review.`,
      is_read: 0,
      created_at: now
    });
    this.setNotifs(notifs);

    return { message: 'Issue created successfully', issue: newIssue };
  }

  updateIssueStatus(id, currentUser, { status, note }) {
    const issues = this.getIssues();
    const issue = issues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    issue.status = status;
    issue.updated_at = new Date().toISOString();
    this.setIssues(issues);

    const replies = this.getReplies();
    if (note && note.trim()) {
      replies.push({
        id: `REP-${Date.now()}`,
        issue_id: id,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_role: 'admin',
        message: note.trim(),
        created_at: new Date().toISOString()
      });
      this.setReplies(replies);
    }

    const notifs = this.getNotifs();
    notifs.unshift({
      id: `NOTIF-${Date.now()}`,
      user_id: issue.student_id,
      issue_id: id,
      message: status === 'Resolved'
        ? `Your issue ${id} has been marked as Resolved. Please provide feedback.`
        : `The status of your issue ${id} changed to "${status}".`,
      is_read: 0,
      created_at: new Date().toISOString()
    });
    this.setNotifs(notifs);

    return { message: `Status updated to ${status}`, issue, replies: replies.filter(r => r.issue_id === id) };
  }

  addReply(issueId, currentUser, message) {
    const replies = this.getReplies();
    const newReply = {
      id: `REP-${Date.now()}`,
      issue_id: issueId,
      sender_id: currentUser.id,
      sender_name: currentUser.name,
      sender_role: currentUser.role,
      message: message.trim(),
      created_at: new Date().toISOString()
    };
    replies.push(newReply);
    this.setReplies(replies);
    return { message: 'Reply sent', reply: newReply };
  }

  submitFeedback(issueId, currentUser, { rating, comment }) {
    const allFb = this.getFeedback();
    const existingIdx = allFb.findIndex(f => f.issue_id === issueId);
    const fbObj = {
      id: `FB-${Date.now()}`,
      issue_id: issueId,
      student_id: currentUser.id,
      rating: Number(rating),
      comment: comment ? comment.trim() : '',
      created_at: new Date().toISOString()
    };
    if (existingIdx >= 0) {
      allFb[existingIdx] = fbObj;
    } else {
      allFb.push(fbObj);
    }
    this.setFeedback(allFb);
    return { message: 'Feedback saved', feedback: fbObj };
  }

  getNotifications(currentUser) {
    const notifs = this.getNotifs().filter(n => n.user_id === currentUser.id);
    const unreadCount = notifs.filter(n => !n.is_read).length;
    return { notifications: notifs, unreadCount };
  }

  markNotifRead(id) {
    const notifs = this.getNotifs();
    const item = notifs.find(n => n.id === id);
    if (item) item.is_read = 1;
    this.setNotifs(notifs);
    return { success: true };
  }

  markAllNotifsRead(currentUser) {
    const notifs = this.getNotifs();
    notifs.forEach(n => {
      if (n.user_id === currentUser.id) n.is_read = 1;
    });
    this.setNotifs(notifs);
    return { success: true };
  }
}

export const mockStore = new MockStore();
