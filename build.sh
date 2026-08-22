#! /bin/bash
npm run build
hugo build
wrangler pages deploy public --project-name tannerlegasse
