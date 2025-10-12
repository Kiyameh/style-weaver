"use client";

import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Checkbox from "@/components/ui/Checkbox";
import Chip from "@/components/ui/Chip";
import { useTheme } from "@/contexts/ThemeContext";
import s from "./FakeDashboard.module.css";
import type { FakeDashboardProps } from "./types";
import { useThemeStyles } from "./useThemeStyles";

const FakeDashboard = ({ className, ...props }: FakeDashboardProps) => {
  /* Obtener el tema actual */
  const { currentTheme } = useTheme();
  /* Convertir el tema a CSS */
  const themeStyles = useThemeStyles(currentTheme);

  /* Verificar disponibilidad de colores de feedback */
  const hasSuccess = currentTheme?.brandColors.success !== undefined;
  const hasError = currentTheme?.brandColors.error !== undefined;
  const hasWarning = currentTheme?.brandColors.warning !== undefined;
  const hasInfo = currentTheme?.brandColors.info !== undefined;

  // Si no hay tema, mostrar mensaje
  if (!currentTheme) {
    return (
      <div
        {...props}
        className={className ? `${s.dashboard} ${className}` : s.dashboard}
      >
        <p style={{ padding: "2rem", textAlign: "center" }}>
          No theme available
        </p>
      </div>
    );
  }

  return (
    <div
      {...props}
      className={className ? `${s.dashboard} ${className}` : s.dashboard}
      style={themeStyles as React.CSSProperties}
    >
      {/* Header */}
      <header className={s.header}>
        <div className={s.headerTitle}>
          <Avatar fallback="AD" size="large" />
          <div>
            <h1 className={s.title}>Dashboard Overview</h1>
            <Chip label="Admin" variant="secondary" />
          </div>
        </div>
        <div className={s.headerActions}>
          <Button variant="secondary">
            <Bell size={20} />
          </Button>
          <Button variant="secondary">
            <Settings size={20} />
          </Button>
          <Button variant="primary">New Project</Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className={s.statsGrid}>
        <Card variant="elevated" className={s.statCard}>
          <div className={s.statHeader}>
            <span className={s.statLabel}>Total Revenue</span>
            <div
              className={s.statIcon}
              style={{
                backgroundColor: "var(--primary-100)",
                color: "var(--primary-content)",
              }}
            >
              <DollarSign size={20} />
            </div>
          </div>
          <h2 className={s.statValue}>$45,231</h2>
          {hasSuccess && (
            <div className={`${s.statChange} ${s.positive}`}>
              <ArrowUp size={16} />
              <span>+20.1% from last month</span>
            </div>
          )}
        </Card>

        <Card variant="elevated" className={s.statCard}>
          <div className={s.statHeader}>
            <span className={s.statLabel}>Active Users</span>
            <div
              className={s.statIcon}
              style={{
                backgroundColor: "var(--secondary-100)",
                color: "var(--secondary-content)",
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <h2 className={s.statValue}>2,350</h2>
          {hasSuccess && (
            <div className={`${s.statChange} ${s.positive}`}>
              <ArrowUp size={16} />
              <span>+15.3% from last month</span>
            </div>
          )}
        </Card>

        <Card variant="elevated" className={s.statCard}>
          <div className={s.statHeader}>
            <span className={s.statLabel}>Orders</span>
            <div
              className={s.statIcon}
              style={{
                backgroundColor: "var(--accent-100)",
                color: "var(--accent-content)",
              }}
            >
              <ShoppingCart size={20} />
            </div>
          </div>
          <h2 className={s.statValue}>1,234</h2>
          {hasError && (
            <div className={`${s.statChange} ${s.negative}`}>
              <ArrowDown size={16} />
              <span>-5.2% from last month</span>
            </div>
          )}
        </Card>

        <Card variant="elevated" className={s.statCard}>
          <div className={s.statHeader}>
            <span className={s.statLabel}>Products</span>
            <div
              className={s.statIcon}
              style={{
                backgroundColor: "var(--neutral-100)",
                color: "var(--neutral-content)",
              }}
            >
              <Package size={20} />
            </div>
          </div>
          <h2 className={s.statValue}>567</h2>
          {hasSuccess && (
            <div className={`${s.statChange} ${s.positive}`}>
              <ArrowUp size={16} />
              <span>+8.7% from last month</span>
            </div>
          )}
        </Card>
      </div>

      {/* Content Grid */}
      <div className={s.contentGrid}>
        {/* Main Content */}
        <div className={s.mainContent}>
          {/* Recent Activity */}
          <section className={s.section}>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Recent Activity</h2>
              <Button variant="ghost">View All</Button>
            </div>
            <div className={s.activityList}>
              <div className={s.activityItem}>
                <div
                  className={s.activityIcon}
                  style={{
                    backgroundColor: "var(--primary-100)",
                    color: "var(--primary-content)",
                  }}
                >
                  <TrendingUp size={20} />
                </div>
                <div className={s.activityContent}>
                  <h3 className={s.activityTitle}>New sale recorded</h3>
                  <p className={s.activityDescription}>
                    Order #12345 has been completed successfully
                  </p>
                </div>
                <span className={s.activityTime}>2 min ago</span>
              </div>

              <div className={s.activityItem}>
                <div
                  className={s.activityIcon}
                  style={{
                    backgroundColor: "var(--secondary-100)",
                    color: "var(--secondary-content)",
                  }}
                >
                  <Users size={20} />
                </div>
                <div className={s.activityContent}>
                  <h3 className={s.activityTitle}>New user registered</h3>
                  <p className={s.activityDescription}>
                    John Doe joined the platform
                  </p>
                </div>
                <span className={s.activityTime}>15 min ago</span>
              </div>

              <div className={s.activityItem}>
                <div
                  className={s.activityIcon}
                  style={{
                    backgroundColor: "var(--accent-100)",
                    color: "var(--accent-content)",
                  }}
                >
                  <Activity size={20} />
                </div>
                <div className={s.activityContent}>
                  <h3 className={s.activityTitle}>System update completed</h3>
                  <p className={s.activityDescription}>
                    All services are running smoothly
                  </p>
                </div>
                <span className={s.activityTime}>1 hour ago</span>
              </div>

              <div className={s.activityItem}>
                <div
                  className={s.activityIcon}
                  style={{
                    backgroundColor: "var(--neutral-200)",
                    color: "var(--neutral-content)",
                  }}
                >
                  <Package size={20} />
                </div>
                <div className={s.activityContent}>
                  <h3 className={s.activityTitle}>Inventory updated</h3>
                  <p className={s.activityDescription}>
                    50 new products added to catalog
                  </p>
                </div>
                <span className={s.activityTime}>3 hours ago</span>
              </div>
            </div>
          </section>

          {/* Alerts Section */}
          <section className={s.section}>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>System Alerts</h2>
            </div>
            <div className={s.alertsSection}>
              {hasInfo && (
                <Alert
                  variant="info"
                  title="Information"
                  icon={<Info size={20} />}
                >
                  Your subscription will renew in 7 days. Make sure your payment
                  method is up to date.
                </Alert>
              )}
              {hasSuccess && (
                <Alert
                  variant="success"
                  title="Success"
                  icon={<CheckCircle2 size={20} />}
                >
                  Backup completed successfully. All data is secure.
                </Alert>
              )}
              {hasWarning && (
                <Alert
                  variant="warning"
                  title="Warning"
                  icon={<AlertCircle size={20} />}
                >
                  Server load is above 80%. Consider upgrading your plan.
                </Alert>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className={s.sidebar}>
          {/* Quick Actions */}
          <section className={s.section}>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Quick Actions</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <Button variant="primary" style={{ width: "100%" }}>
                Create Invoice
              </Button>
              <Button variant="secondary" style={{ width: "100%" }}>
                Add Customer
              </Button>
              <Button variant="ghost" style={{ width: "100%" }}>
                Generate Report
              </Button>
            </div>
          </section>

          {/* Tasks */}
          <section className={s.section}>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Pending Tasks</h2>
              <Chip label="5" variant="primary" />
            </div>
            <div className={s.taskList}>
              <div className={s.taskItem}>
                <Checkbox defaultChecked={false} />
                <div className={s.taskContent}>
                  <h3 className={s.taskTitle}>Review customer feedback</h3>
                </div>
                <Clock size={16} style={{ color: "var(--content-200)" }} />
              </div>
              <div className={s.taskItem}>
                <Checkbox defaultChecked={false} />
                <div className={s.taskContent}>
                  <h3 className={s.taskTitle}>Update product descriptions</h3>
                </div>
                <Clock size={16} style={{ color: "var(--content-200)" }} />
              </div>
              <div className={s.taskItem}>
                <Checkbox defaultChecked />
                <div className={s.taskContent}>
                  <h3 className={s.taskTitle}>Process refund requests</h3>
                </div>
                <CheckCircle2
                  size={16}
                  style={{ color: "var(--success-100)" }}
                />
              </div>
              <div className={s.taskItem}>
                <Checkbox defaultChecked={false} />
                <div className={s.taskContent}>
                  <h3 className={s.taskTitle}>Prepare monthly report</h3>
                </div>
                <Clock size={16} style={{ color: "var(--content-200)" }} />
              </div>
            </div>
          </section>

          {/* Team Members */}
          <section className={s.section}>
            <div className={s.sectionHeader}>
              <h2 className={s.sectionTitle}>Team Members</h2>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Avatar
                  fallback="JD"
                  size="medium"
                  style={{
                    backgroundColor: "var(--primary-200)",
                    color: "var(--primary-content)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--content-500)",
                    }}
                  >
                    John Doe
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--content-300)",
                    }}
                  >
                    Product Manager
                  </div>
                </div>
                <Chip label="Online" variant="primary" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Avatar
                  fallback="JS"
                  size="medium"
                  style={{
                    backgroundColor: "var(--secondary-200)",
                    color: "var(--secondary-content)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--content-500)",
                    }}
                  >
                    Jane Smith
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--content-300)",
                    }}
                  >
                    Lead Designer
                  </div>
                </div>
                <Chip label="Away" variant="secondary" />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <Avatar
                  fallback="MB"
                  size="medium"
                  style={{
                    backgroundColor: "var(--accent-200)",
                    color: "var(--accent-content)",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--content-500)",
                    }}
                  >
                    Mike Brown
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--content-300)",
                    }}
                  >
                    Developer
                  </div>
                </div>
                <Chip label="Offline" variant="ghost" />
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerLinks}>
          <button type="button" className={s.footerLink}>
            Privacy Policy
          </button>
          <button type="button" className={s.footerLink}>
            Terms of Service
          </button>
          <button type="button" className={s.footerLink}>
            Support
          </button>
          <button type="button" className={s.footerLink}>
            Documentation
          </button>
        </div>
        <div className={s.footerCopy}>
          © 2025 StyleWeaver. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default FakeDashboard;
