#!/usr/bin/env python3
import subprocess
import os
import sys
from datetime import datetime

TARGET_DATE = "2025-11-25 12:00:00"

def run_command(cmd, env=None):
    if env is None:
        env = os.environ.copy()
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='ignore', env=env)
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def main():
    print("=== Rewriting Last 3 Commits to 2025-11-25 ===\n")

    # verify repo
    _, _, code = run_command("git rev-parse --git-dir")
    if code != 0:
        print("Not a git repo")
        sys.exit(1)

    # Get branch
    current_branch, _, _ = run_command("git rev-parse --abbrev-ref HEAD")
    print(f"Branch: {current_branch}")

    # Get all commits (Newest -> Oldest)
    # Format: Hash ||| Author ||| Email ||| Date ||| Message
    commits_raw, _, _ = run_command('git log --format="%H|||%an|||%ae|||%ad|||%s" --date=iso-strict')
    
    if not commits_raw:
        print("No commits found")
        sys.exit(1)
        
    lines = commits_raw.split('\n')
    commits = []
    
    for line in lines:
        parts = line.split('|||')
        if len(parts) >= 5:
            commits.append({
                'hash': parts[0],
                'author': parts[1],
                'email': parts[2],
                'date': parts[3],
                'message': '|||'.join(parts[4:])
            })

    print(f"Total commits: {len(commits)}")
    if len(commits) < 3:
        print("Warning: Less than 3 commits in repo. All will be changed.")

    # We process from Oldest -> Newest to rebuild
    # So we reverse the list
    commits.reverse() 
    
    # Now commits[0] is Root (Oldest), commits[-1] is HEAD (Newest)
    # Target: Change last 3 (indices -1, -2, -3)
    
    target_start_index = len(commits) - 3
    if target_start_index < 0:
        target_start_index = 0

    print(f"\nPlan:")
    for i, c in enumerate(commits):
        if i >= target_start_index:
            print(f"  [CHANGE] {c['hash'][:7]} -> {TARGET_DATE} ({c['message'][:30]}...)")
            c['new_date'] = TARGET_DATE
        else:
            print(f"  [KEEP  ] {c['hash'][:7]} -> {c['date']} ({c['message'][:30]}...)")
            c['new_date'] = c['date'] # Keep original

    # Backup
    backup_branch = f"backup-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    run_command(f"git branch {backup_branch}")
    print(f"\nBackup created at {backup_branch}")

    # Orphan branch for rebuild
    temp_branch = f"temp-rewrite-{datetime.now().strftime('%H%M%S')}"
    run_command(f"git checkout --orphan {temp_branch}")
    
    # Rebuild
    env = os.environ.copy()
    
    print("\nRebuilding history...")
    for i, c in enumerate(commits):
        # Checkout files from original
        run_command(f"git checkout {c['hash']} -- .")
        run_command("git add -A")
        
        env['GIT_AUTHOR_NAME'] = c['author']
        env['GIT_AUTHOR_EMAIL'] = c['email']
        env['GIT_AUTHOR_DATE'] = c['new_date']
        env['GIT_COMMITTER_NAME'] = c['author']
        env['GIT_COMMITTER_EMAIL'] = c['email']
        env['GIT_COMMITTER_DATE'] = c['new_date']
        
        msg = c['message'].replace('"', '\\"')
        run_command(f'git commit -m "{msg}"', env=env)
        print(f"  Committed {i+1}/{len(commits)}")

    print("\nReplacing branch...")
    run_command(f"git branch -f {current_branch} {temp_branch}")
    run_command(f"git checkout {current_branch}")
    run_command(f"git branch -D {temp_branch}")
    
    print("Done! Dates updated.")
    
if __name__ == "__main__":
    main()
