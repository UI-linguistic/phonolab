import asyncio
import logging
import sys
from argparse import ArgumentParser
from typing import Awaitable, Callable


logger = logging.getLogger(__name__)


def cli_runner(parser: ArgumentParser, async_main: Callable[[any, ArgumentParser], Awaitable[int]]) -> None:
    args = parser.parse_args()
    try:
        ret = asyncio.get_event_loop().run_until_complete(async_main(args, parser))
    except KeyboardInterrupt:
        print("Interrupted by user, shutting down.")
        for task in asyncio.all_tasks(asyncio.get_event_loop()):
            task.cancel()
        ret = 1
    finally:
        pending = asyncio.all_tasks(asyncio.get_event_loop())
        asyncio.get_event_loop().run_until_complete(asyncio.gather(*pending, return_exceptions=True))

    sys.exit(ret)
