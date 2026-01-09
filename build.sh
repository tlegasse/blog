#! /bin/bash
hugo build && wrangler pages deploy public --project-name tannerlegasse
