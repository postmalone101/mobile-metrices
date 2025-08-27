// Utility functions for formatting
function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  if (!bytes || bytes < 0) return "N/A";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    return formatDate(dateString);
  }
}

// Main dashboard functionality
class BundleDashboard {
  constructor() {
    this.data = [];
    this.tbody = document.getElementById("bundle-tbody");
    this.loadData();
  }

  async loadData() {
    try {
      const response = await fetch("data/bundle-sizes.json");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      this.data = await response.json();
      this.renderTable();
      this.updateStats();
    } catch (error) {
      console.error("Failed to load bundle data:", error);
      this.showError(
        "Failed to load data. Please check if data/bundle-sizes.json exists."
      );
    }
  }

  renderTable() {
    if (!this.data || this.data.length === 0) {
      this.tbody.innerHTML =
        '<tr><td colspan="6" class="error">No data available</td></tr>';
      return;
    }

    // Sort by timestamp (newest first)
    const sortedData = [...this.data].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    this.tbody.innerHTML = sortedData
      .map((entry) => {
        const androidSize = this.formatSizeCell(
          entry.android_size,
          entry.android_error,
          "android"
        );
        const iosSize = this.formatSizeCell(
          entry.ios_size,
          entry.ios_error,
          "ios"
        );
        const version = this.formatVersionCell(entry);
        const action = this.formatActionCell(entry);

        return `
                <tr>
                    <td class="date-cell">${formatDate(entry.timestamp)}</td>
                    <td class="version-cell">${version}</td>
                    <td class="repo-cell">${entry.repo || "Unknown"}</td>
                    <td class="size-cell">${androidSize}</td>
                    <td class="size-cell">${iosSize}</td>
                    <td>${action}</td>
                </tr>
            `;
      })
      .join("");
  }

  formatSizeCell(size, error, platform) {
    if (error) {
      return `<span class="size-error">Error</span>`;
    }

    if (!size || size === 0) {
      return `<span class="size-error">N/A</span>`;
    }

    return `<span class="size-${platform}">${formatBytes(size)}</span>`;
  }

  formatVersionCell(entry) {
    if (entry.pr_number) {
      const prText = `PR #${entry.pr_number}`;
      if (entry.pr_url) {
        return `<a href="${entry.pr_url}" target="_blank" class="pr-link">${prText}</a>`;
      }
      return prText;
    }

    if (entry.branch) {
      return entry.branch;
    }

    if (entry.commit_sha) {
      return entry.commit_sha;
    }

    return "Unknown";
  }

  formatActionCell(entry) {
    const actions = [];

    if (entry.pr_url) {
      actions.push(
        `<a href="${entry.pr_url}" target="_blank" class="action-link">View PR</a>`
      );
    }

    if (entry.commit_sha && entry.repo) {
      const commitUrl = `https://github.com/jisr-hr/${entry.repo}/commit/${entry.commit_sha}`;
      actions.push(
        `<a href="${commitUrl}" target="_blank" class="action-link">Commit</a>`
      );
    }

    return actions.join(" ");
  }

  updateStats() {
    if (!this.data || this.data.length === 0) {
      return;
    }

    // Total entries
    document.getElementById("total-entries").textContent = this.data.length;

    // Latest entry
    const latest = this.data.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp)
        ? current
        : latest;
    });

    // Latest sizes
    const latestAndroid = latest.android_error
      ? "Error"
      : formatBytes(latest.android_size);
    const latestIos = latest.ios_error ? "Error" : formatBytes(latest.ios_size);

    document.getElementById("latest-android").textContent = latestAndroid;
    document.getElementById("latest-ios").textContent = latestIos;

    // Last updated
    document.getElementById("last-updated").textContent = formatRelativeTime(
      latest.timestamp
    );
  }

  showError(message) {
    this.tbody.innerHTML = `<tr><td colspan="6" class="error">${message}</td></tr>`;
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BundleDashboard();
});

// Auto-refresh every 5 minutes
setInterval(() => {
  window.location.reload();
}, 5 * 60 * 1000);
