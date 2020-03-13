# Logging Bugs

1. Start logging an issue in the [issue tracker](https://github.com/dsherret/ts-nameof/issues).
1. Clearly identify the problem and submit some reproduction code.
    * Prune the reproduction to remove needless details.
1. State the current and expected behaviour.
1. State the version of ts-nameof (always show a reproduction of the bug on the latest version).

# Contributing Bug Fixes

1. Follow the instructions above about logging a bug. In addition:
    1. State that you are going to work on the bug.
    1. Discuss major structural changes in the issue before doing the work to ensure it makes sense and work isn't wasted.
1. Start working on the fix in a branch and submit a PR when done.
1. Ensure `rush verify` passes when run in the root directory.

# Contributing Features

1. Log an issue in the [issue tracker](https://github.com/dsherret/ts-nameof/issues). In the issue:
    1. Propose the change.
        * Outline all changes that will be made to the public API.
        * Discuss any structural changes to the code if necessary.
    1. Wait for discussion and green light from [@dsherret](https://github.com/dsherret) (who will try to reply as soon as possible, but it might take a few days).
        * Note: If the change is small and you think it wouldn't take you too much time, then feel free to start working on it and even submit a PR. Just beware that you're taking the risk that it could be denied.
1. After approval, start working on the change in a branch and submit a PR.
1. Read [DEVELOPMENT.md](DEVELOPMENT.md) for some useful information.
1. Ensure `rush verify` passes when run in the root directory.
