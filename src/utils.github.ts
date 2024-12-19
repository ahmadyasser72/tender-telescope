import { GITHUB_REPOSITORY } from "astro:env/client";

export const getGithubRelease = async () => {
  if (GITHUB_REPOSITORY === undefined) return;

  const release = { format: "", suffix: "", os: "" };
  const UA = navigator.userAgent;
  if (UA.includes("Android")) {
    release.format = "APK";
    release.suffix = "universal-release.apk";
    release.os = "android";
  } else {
    const is64Bit =
      UA.includes("WOW64") ||
      UA.includes("Win64") ||
      UA.includes("x86_64") ||
      UA.includes("amd64");

    if (!is64Bit) return;
    else if (UA.includes("Linux")) {
      release.format = "AppImage";
      release.suffix = "amd64.AppImage";
      release.os = "linux";
    } else if (UA.includes("Windows")) {
      release.format = "setup.exe";
      release.suffix = "x64-setup.exe";
      release.os = "windows";
    }
  }

  if (Object.values(release).some((it) => it === "")) return;

  const {
    assets,
    tag_name: version,
    published_at: publishDate,
  }: GithubRelease = await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/releases/latest`,
  ).then((response) => response.json());

  const { format, suffix, os } = release;
  for (const { name, size, browser_download_url: url } of assets) {
    if (name.endsWith(suffix)) {
      const latestCommitDate = await getLatestGithubCommitDate();
      const outdated = new Date(publishDate) < new Date(latestCommitDate);
      return { format, os, version, size, url, outdated };
    }
  }
};

const getLatestGithubCommitDate = async () => {
  const commits: GithubCommit[] = await fetch(
    `https://api.github.com/repos/${GITHUB_REPOSITORY}/commits`,
  ).then((response) => response.json());

  return commits[0].commit.author.date;
};

interface GithubRelease {
  tag_name: string;
  published_at: string;
  assets: GithubReleaseAsset[];
}

interface GithubReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

interface GithubCommit {
  commit: { author: { date: string } };
}
