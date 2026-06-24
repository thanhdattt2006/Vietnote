import React, { useEffect, useState } from 'react';
import adminApi from '../../api/adminApi';
import {
  Users,
  MessageSquare,
  FileText,
  Trash2,
  Search,
  Send,
  PieChart as PieIcon,
  TrendingUp,
  Eye,
} from 'lucide-react';
import LoadingOverlay from '../../components/common/LoadingOverlay';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CustomPaginator from '../../components/common/CustomPaginator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import BroadcastModal from '../../components/common/BroadcastModal';
import UserDetailModal from '../../components/common/UserDetailModal';

const COLORS = ['#38bdf8', '#34d399', '#facc15', '#f87171'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [usersData, setUsersData] = useState({ data: [], total: 0, page: 1, limit: 10 });
  const [feedbacksData, setFeedbacksData] = useState({ data: [], total: 0, page: 1, limit: 10 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => { loadAllData(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'users') loadUsers(1, searchKeyword);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, feedbacksRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(1),
        adminApi.getFeedbacks(1),
      ]);
      setStats(statsRes);
      setUsersData({ data: usersRes.data, total: usersRes.total, page: usersRes.current_page, limit: usersRes.per_page });
      setFeedbacksData({ data: feedbacksRes.data, total: feedbacksRes.total, page: feedbacksRes.current_page, limit: feedbacksRes.per_page });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async (page, keyword) => {
    const res = await adminApi.getUsers(page, keyword);
    setUsersData({ data: res.data, total: res.total, page: res.current_page, limit: res.per_page });
  };

  const loadFeedbacks = async (page) => {
    const res = await adminApi.getFeedbacks(page);
    setFeedbacksData({ data: res.data, total: res.total, page: res.current_page, limit: res.per_page });
  };

  const handleDeleteUser = (id) => {
    setConfirmDialog({
      type: 'danger',
      title: 'Xóa người dùng',
      message: 'Hành động này sẽ xóa vĩnh viễn user và toàn bộ dữ liệu.',
      onConfirm: async () => {
        try {
          await adminApi.deleteUser(id);
          setConfirmDialog(null);
          loadUsers(usersData.page, searchKeyword);
          setStats(await adminApi.getStats());
        } catch (e) {
          alert('Lỗi: ' + e.response?.data?.message);
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const handleDeleteFeedback = (id) => {
    setConfirmDialog({
      type: 'danger',
      title: 'Xóa phản hồi',
      message: 'Bạn muốn xóa phản hồi này?',
      onConfirm: async () => {
        try {
          await adminApi.deleteFeedback(id);
          setConfirmDialog(null);
          loadFeedbacks(feedbacksData.page);
          setStats(await adminApi.getStats());
        } catch (e) {
          alert('Lỗi xóa feedback');
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const pieData = stats ? [
    { name: 'Nam', value: stats.gender_stats.male },
    { name: 'Nữ', value: stats.gender_stats.female },
    { name: 'Khác', value: stats.gender_stats.other },
  ].filter((x) => x.value > 0) : [];

  return (
    <div className="relative min-h-[80vh] pb-12 text-[#E8EAED]">
      <LoadingOverlay isVisible={isLoading} className="fixed inset-0 z-[9999]" />

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#E8EAED] mb-1">Dashboard</h1>
          <p className="text-sm text-[#9AA0A6]">Thống kê & Quản lý hệ thống</p>
        </div>
        <button
          className="flex items-center gap-2 bg-[#38bdf8] text-[#0f172a] font-bold py-2 px-4 rounded-lg hover:bg-[#0284c7] transition-colors"
          onClick={() => setShowBroadcastModal(true)}
        >
          <Send size={18} /> Gửi thông báo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard title="Tổng Users" value={stats?.total_users || 0} icon={<Users size={24} color="#38bdf8" />} />
        <StatCard title="Tổng Notes" value={stats?.total_notes || 0} icon={<FileText size={24} color="#34d399" />} />
        <StatCard title="Phản hồi" value={stats?.total_responses || 0} icon={<MessageSquare size={24} color="#facc15" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        <div className="lg:col-span-2 bg-[#2A2A38] p-5 rounded-xl border border-[#3C3C4A]">
          <h3 className="flex items-center gap-2 text-[#E8EAED] text-lg mb-5">
            <TrendingUp size={20} color="#34d399" /> Tăng trưởng
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats?.growth_chart || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3C3C4A" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9AA0A6' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9AA0A6' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #3C3C4A', background: '#1A1A24', color: '#E8EAED' }} itemStyle={{ color: '#E8EAED' }} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar dataKey="Users" name="User mới" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="Notes" name="Note mới" fill="#34d399" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#2A2A38] p-5 rounded-xl border border-[#3C3C4A]">
          <h3 className="flex items-center gap-2 text-[#E8EAED] text-lg mb-5">
            <PieIcon size={20} color="#facc15" /> Giới tính
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #3C3C4A', background: '#1A1A24', color: '#E8EAED' }} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#2A2A38] rounded-xl border border-[#3C3C4A] overflow-hidden">
        <div className="flex justify-between items-center border-b border-[#3C3C4A] pr-5">
          <div className="flex">
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Users</TabButton>
            <TabButton active={activeTab === 'feedbacks'} onClick={() => setActiveTab('feedbacks')}>Feedbacks</TabButton>
          </div>
          {activeTab === 'users' && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Tìm user..."
                className="pl-9 pr-3 py-2 rounded-full border border-[#3C3C4A] bg-[#1A1A24] text-white outline-none text-sm focus:border-[#38bdf8] transition-colors"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'users' ? (
            <>
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-[#1A1A24]">
                  <tr className="text-left text-[#9AA0A6] text-xs uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">User Info</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Notes</th>
                    <th className="p-4">Join Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.data.map((u) => (
                    <tr key={u.id} className="border-b border-[#3C3C4A] text-[#E8EAED] hover:bg-[#323242] transition-colors">
                      <td className="p-4">{u.id}</td>
                      <td className="p-4">
                        <div className="font-semibold">{u.name || 'No Name'}</div>
                        <div className="text-xs text-[#9AA0A6]">{u.username}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-sky-400/20 text-sky-400' : 'bg-[#3C3C4A] text-[#9AA0A6]'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold">
                        <span className={u.notes_count > 0 ? 'text-emerald-400' : 'text-slate-500'}>{u.notes_count}</span>
                      </td>
                      <td className="p-4 text-sm text-[#9AA0A6]">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedUser(u)} className="p-2 rounded-md bg-sky-400/10 text-sky-400 hover:bg-sky-400/20 transition-colors">
                            <Eye size={16} />
                          </button>
                          {u.role !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded-md bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4">
                <CustomPaginator first={(usersData.page - 1) * usersData.limit} rows={usersData.limit} totalRecords={usersData.total} onPageChange={(e) => loadUsers(e.first / e.rows + 1)} />
              </div>
            </>
          ) : (
            <>
              <table className="w-full border-collapse min-w-[700px]">
                <thead className="bg-[#1A1A24]">
                  <tr className="text-left text-[#9AA0A6] text-xs uppercase tracking-wider">
                    <th className="p-4">ID</th>
                    <th className="p-4">Sender</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Content</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacksData.data.map((f) => (
                    <tr key={f.id} className="border-b border-[#3C3C4A] text-[#E8EAED] hover:bg-[#323242] transition-colors">
                      <td className="p-4">{f.id}</td>
                      <td className="p-4">
                        <div className="font-semibold">{f.name}</div>
                        <div className="text-xs text-[#9AA0A6]">{f.gmail}</div>
                      </td>
                      <td className="p-4 font-medium">{f.subject}</td>
                      <td className="p-4 text-sm text-[#9AA0A6] max-w-[300px] truncate">{f.content}</td>
                      <td className="p-4 text-sm text-[#9AA0A6]">{new Date(f.sentAt).toLocaleString()}</td>
                      <td className="p-4">
                        <button onClick={() => handleDeleteFeedback(f.id)} className="p-2 rounded-md bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4">
                <CustomPaginator first={(feedbacksData.page - 1) * feedbacksData.limit} rows={feedbacksData.limit} totalRecords={feedbacksData.total} onPageChange={(e) => loadFeedbacks(e.first / e.rows + 1)} />
              </div>
            </>
          )}
        </div>
      </div>

      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
      <BroadcastModal isOpen={showBroadcastModal} onClose={() => setShowBroadcastModal(false)} onSuccess={() => alert('Đã gửi email thành công!')} />
      <UserDetailModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} user={selectedUser} />
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="flex flex-col justify-between min-h-[120px] p-5 bg-[#2A2A38] rounded-xl border border-[#3C3C4A] text-[#E8EAED]">
    <div className="flex justify-between items-center">
      <span className="opacity-70 font-medium text-sm">{title}</span>
      <div className="p-2 bg-white/5 rounded-full">{icon}</div>
    </div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-4 font-semibold text-[0.95rem] transition-colors border-b-2 ${active ? 'border-sky-400 text-sky-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}
  >
    {children}
  </button>
);

export default DashboardPage;
