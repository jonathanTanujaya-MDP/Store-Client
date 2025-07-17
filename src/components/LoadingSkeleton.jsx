import React from 'react';
import './LoadingSkeleton.css';

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    <div className="skeleton-header">
      {[...Array(columns)].map((_, i) => (
        <div key={i} className="skeleton-header-cell" />
      ))}
    </div>
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="skeleton-row">
        {[...Array(columns)].map((_, j) => (
          <div key={j} className="skeleton-cell" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="card-skeleton">
    <div className="skeleton-icon" />
    <div className="skeleton-content">
      <div className="skeleton-title" />
      <div className="skeleton-value" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="chart-skeleton">
    <div className="skeleton-chart-header" />
    <div className="skeleton-chart-body">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton-bar" style={{ height: `${Math.random() * 100 + 20}%` }} />
      ))}
    </div>
  </div>
);
