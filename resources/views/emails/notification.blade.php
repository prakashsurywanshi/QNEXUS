<x-mail::message>
# {{ $title }}

@if($body)
{{ $body }}
@endif

@if($link)
<x-mail::button :url="$link">
View details
</x-mail::button>
@endif

— {{ $societyName }}
</x-mail::message>
