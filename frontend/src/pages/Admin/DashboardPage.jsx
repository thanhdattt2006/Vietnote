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

const COLORS = ['#38bdf8', '#34d399', '#facc15', '#f87171']; // Màu tươi hơn cho nền tối

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [usersData, setUsersData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [feedbacksData, setFeedbacksData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);
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
      setUsersData({
        data: usersRes.data,
        total: usersRes.total,
        page: usersRes.current_page,
        limit: usersRes.per_page,
      });
      setFeedbacksData({
        data: feedbacksRes.data,
        total: feedbacksRes.total,
        page: feedbacksRes.current_page,
        limit: feedbacksRes.per_page,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async (page, keyword) => {
    const res = await adminApi.getUsers(page, keyword);
    setUsersData({
      data: res.data,
      total: res.total,
      page: res.current_page,
      limit: res.per_page,
    });
  };
  const loadFeedbacks = async (page) => {
    const res = await adminApi.getFeedbacks(page);
    setFeedbacksData({
      data: res.data,
      total: res.total,
      page: res.current_page,
      limit: res.per_page,
    });
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
          const newStats = await adminApi.getStats();
          setStats(newStats);
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
          const newStats = await adminApi.getStats();
          setStats(newStats);
        } catch (e) {
          alert('Lỗi xóa feedback');
        }
      },
      onCancel: () => setConfirmDialog(null),
    });
  };

  const pieData = stats
    ? [
        { name: 'Nam', value: stats.gender_stats.male },
        { name: 'Nữ', value: stats.gender_stats.female },
        { name: 'Khác', value: stats.gender_stats.other },
      ].filter((x) => x.value > 0)
    : [];

  return (
    <div
      className='relative-container'
      style={{ minHeight: '80vh', paddingBottom: '50px', color: '#E8EAED' }}
    >
      <LoadingOverlay
        isVisible={isLoading}
        style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      />

      {/* HEADER */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '1.8rem',
              color: '#E8EAED',
              marginBottom: '5px',
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: '#9AA0A6', fontSize: '0.9rem' }}>
            Thống kê & Quản lý hệ thống
          </p>
        </div>
        <button
          className='btn btn-primary'
          onClick={() => setShowBroadcastModal(true)}
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: '#38bdf8',
            color: '#0f172a',
            fontWeight: 'bold',
            border: 'none',
          }}
        >
          <Send size={18} /> Gửi thông báo
        </button>
      </div>

      {/* STATS CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          title='Tổng Users'
          value={stats?.total_users || 0}
          icon={<Users size={24} color='#38bdf8' />}
        />
        <StatCard
          title='Tổng Notes'
          value={stats?.total_notes || 0}
          icon={<FileText size={24} color='#34d399' />}
        />
        <StatCard
          title='Phản hồi'
          value={stats?.total_responses || 0}
          icon={<MessageSquare size={24} color='#facc15' />}
        />
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '20px',
          marginBottom: '2rem',
        }}
      >
        {/* Growth Chart */}
        <div
          className='card'
          style={{
            background: '#2A2A38',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #3C3C4A',
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              color: '#E8EAED',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.1rem',
            }}
          >
            <TrendingUp size={20} color='#34d399' /> Tăng trưởng
          </h3>
          <ResponsiveContainer width='100%' height={280}>
            <BarChart data={stats?.growth_chart || []}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#3C3C4A'
              />
              <XAxis
                dataKey='name'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9AA0A6' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9AA0A6' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #3C3C4A',
                  background: '#1A1A24',
                  color: '#E8EAED',
                }}
                itemStyle={{ color: '#E8EAED' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Bar
                dataKey='Users'
                name='User mới'
                fill='#38bdf8'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                dataKey='Notes'
                name='Note mới'
                fill='#34d399'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Pie Chart */}
        <div
          className='card'
          style={{
            background: '#2A2A38',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #3C3C4A',
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              color: '#E8EAED',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '1.1rem',
            }}
          >
            <PieIcon size={20} color='#facc15' /> Giới tính
          </h3>
          <ResponsiveContainer width='100%' height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='value'
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #3C3C4A',
                  background: '#1A1A24',
                  color: '#E8EAED',
                }}
              />
              <Legend verticalAlign='bottom' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLES */}
      <div
        style={{
          background: '#2A2A38',
          borderRadius: '12px',
          border: '1px solid #3C3C4A',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #3C3C4A',
            paddingRight: '20px',
          }}
        >
          <div style={{ display: 'flex' }}>
            <TabButton
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            >
              Users
            </TabButton>
            <TabButton
              active={activeTab === 'feedbacks'}
              onClick={() => setActiveTab('feedbacks')}
            >
              Feedbacks
            </TabButton>
          </div>
          {activeTab === 'users' && (
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                placeholder='Tìm user...'
                style={{
                  padding: '8px 10px 8px 35px',
                  borderRadius: '20px',
                  border: '1px solid #3C3C4A',
                  background: '#1A1A24',
                  color: 'white',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ padding: '0', overflowX: 'auto' }}>
          {activeTab === 'users' ? (
            <>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '700px',
                }}
              >
                <thead style={{ background: '#1A1A24' }}>
                  <tr
                    style={{
                      textAlign: 'left',
                      color: '#9AA0A6',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '15px' }}>ID</th>
                    <th>User Info</th>
                    <th>Role</th>
                    <th style={{ textAlign: 'center' }}>Notes</th>
                    <th>Join Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.data.map((u) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom: '1px solid #3C3C4A',
                        color: '#E8EAED',
                      }}
                    >
                      <td style={{ padding: '15px' }}>{u.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {u.name || 'No Name'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#9AA0A6' }}>
                          {u.username}
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            background:
                              u.role === 'admin'
                                ? 'rgba(56, 189, 248, 0.2)'
                                : '#3C3C4A',
                            color: u.role === 'admin' ? '#38bdf8' : '#9AA0A6',
                          }}
                        >
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            fontWeight: 'bold',
                            color: u.notes_count > 0 ? '#34d399' : '#64748b',
                          }}
                        >
                          {u.notes_count}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.9rem', color: '#9AA0A6' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => setSelectedUser(u)}
                            style={{
                              color: '#38bdf8',
                              background: 'rgba(56, 189, 248, 0.1)',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '6px',
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              style={{
                                color: '#f87171',
                                background: 'rgba(248, 113, 113, 0.1)',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '6px',
                                borderRadius: '6px',
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '15px' }}>
                <CustomPaginator
                  first={(usersData.page - 1) * usersData.limit}
                  rows={usersData.limit}
                  totalRecords={usersData.total}
                  onPageChange={(e) => loadUsers(e.first / e.rows + 1)}
                />
              </div>
            </>
          ) : (
            <>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '700px',
                }}
              >
                <thead style={{ background: '#1A1A24' }}>
                  <tr
                    style={{
                      textAlign: 'left',
                      color: '#9AA0A6',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    <th style={{ padding: '15px' }}>ID</th>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Content</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacksData.data.map((f) => (
                    <tr
                      key={f.id}
                      style={{
                        borderBottom: '1px solid #3C3C4A',
                        color: '#E8EAED',
                      }}
                    >
                      <td style={{ padding: '15px' }}>{f.id}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{f.name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#9AA0A6' }}>
                          {f.gmail}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500 }}>{f.subject}</td>
                      <td
                        style={{
                          fontSize: '0.9rem',
                          color: '#9AA0A6',
                          maxWidth: '300px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {f.content}
                      </td>
                      <td style={{ fontSize: '0.9rem', color: '#9AA0A6' }}>
                        {new Date(f.sentAt).toLocaleString()}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteFeedback(f.id)}
                          style={{
                            color: '#f87171',
                            background: 'rgba(248, 113, 113, 0.1)',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '6px',
                            borderRadius: '6px',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '15px' }}>
                <CustomPaginator
                  first={(feedbacksData.page - 1) * feedbacksData.limit}
                  rows={feedbacksData.limit}
                  totalRecords={feedbacksData.total}
                  onPageChange={(e) => loadFeedbacks(e.first / e.rows + 1)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {confirmDialog && <ConfirmDialog isOpen={true} {...confirmDialog} />}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onSuccess={() => alert('Đã gửi email thành công!')}
      />
      <UserDetailModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </div>
  );
};

// Components Phụ (Tối màu)
const StatCard = ({ title, value, icon }) => (
  <div
    style={{
      padding: '20px',
      background: '#2A2A38',
      borderRadius: '12px',
      border: '1px solid #3C3C4A',
      color: '#E8EAED',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '120px',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ opacity: 0.7, fontWeight: 500, fontSize: '0.9rem' }}>
        {title}
      </span>
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '8px',
          borderRadius: '50%',
        }}
      >
        {icon}
      </div>
    </div>
    <div style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>{value}</div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '15px 25px',
      borderBottom: active ? '3px solid #38bdf8' : '3px solid transparent',
      color: active ? '#38bdf8' : '#9AA0A6',
      fontWeight: active ? '700' : '500',
      background: 'none',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      cursor: 'pointer',
      fontSize: '0.95rem',
      transition: 'all 0.2s',
    }}
  >
    {children}
  </button>
);

export default DashboardPage;
