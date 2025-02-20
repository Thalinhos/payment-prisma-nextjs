export async function GET() {
    const status = Math.random() > 0.5 ? "succeed" : "fail";
    // const status = 'succeed';
    
    return new Response(
      JSON.stringify({ status: status }),
      { headers: { "Content-Type": "application/json" } }
    );
  }
  