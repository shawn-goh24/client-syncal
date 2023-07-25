import Head from "next/head";
import React from "react";

export default function Header({ title }) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="keywords" content="web calendar" />
      </Head>
    </div>
  );
}
